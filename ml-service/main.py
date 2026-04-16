from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
import time

app = FastAPI(title="SpendSmart ML Service", version="1.0")

# Globals for models
models = {}

class CategoriseRequest(BaseModel):
    merchant_name: str
    amount: float

class ScoreRequest(BaseModel):
    user_id: str
    category: str
    amount: float
    hour_of_day: int
    same_category_count_today: int
    budget_remaining_percent: float
    is_weekend: bool
    payday_proximity: int
    time_since_last_same_merchant_mins: int

class PredictRequest(BaseModel):
    user_id: str
    morning_spend: float
    day_of_week: int
    yesterday_total: float
    rolling_7day_avg: float
    payday_proximity: int
    budget_remaining_percent: float
    last_week_same_day: float

@app.on_event("startup")
def load_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base_dir, 'models')
    
    try:
        models['tfidf'] = joblib.load(os.path.join(model_dir, 'tfidf_vectorizer.pkl'))
        models['categoriser'] = joblib.load(os.path.join(model_dir, 'categoriser.pkl'))
        
        models['pred_scaler'] = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
        models['predictor'] = joblib.load(os.path.join(model_dir, 'predictor.pkl'))
        
        models['cluster_scaler'] = joblib.load(os.path.join(model_dir, 'cluster_scaler.pkl'))
        models['pca'] = joblib.load(os.path.join(model_dir, 'pca.pkl'))
        models['clusterer'] = joblib.load(os.path.join(model_dir, 'clusterer.pkl'))
        print("All models loaded successfully!")
    except Exception as e:
        print(f"Warning: Models not fully loaded. {e}")

@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": list(models.keys())}

@app.post("/categorise")
def categorise_transaction(req: CategoriseRequest):
    start_time = time.time()
    
    if 'tfidf' not in models or 'categoriser' not in models:
        raise HTTPException(status_code=503, detail="Categoriser models not loaded")
        
    merchant_clean = req.merchant_name.lower()
    
    # Predict
    X = models['tfidf'].transform([merchant_clean])
    category = models['categoriser'].predict(X)[0]
    
    # Get probability
    probs = models['categoriser'].predict_proba(X)[0]
    confidence = max(probs)
    
    processing_time = int((time.time() - start_time) * 1000)
    
    return {
        "category": category,
        "confidence": float(confidence),
        "flagged_for_review": confidence < 0.70,
        "processing_time_ms": processing_time
    }

@app.post("/score")
def score_transaction(req: ScoreRequest):
    # Rule based according to blueprint PRD
    score = 0.0
    flags = []
    
    if req.hour_of_day > 21:
        score += 2
        flags.append("night_transaction")
        
    if req.same_category_count_today >= 3:
        score += 2
        flags.append("high_frequency_same_category")
        
    if req.budget_remaining_percent < 0.20:
        score += 2
        flags.append("budget_critical")
        
    if req.is_weekend:
        score += 1
        flags.append("weekend_spending")
        
    if req.time_since_last_same_merchant_mins < 30:
        score += 1
        flags.append("rapid_reorder")
        
    if req.payday_proximity <= 3:
        score += 1
        flags.append("payday_proximity")
        
    # Determine risk level
    if score <= 3: risk = "low"
    elif score <= 6: risk = "medium"
    elif score <= 8: risk = "high"
    else: risk = "critical"
    
    # Determine defaults
    invest_multiplier = 1.0
    intensity = "gentle"
    if score > 4: 
        invest_multiplier = 1.25
        intensity = "moderate"
    if score > 7: 
        invest_multiplier = 1.5
        intensity = "strong"
        
    return {
        "impulse_score": float(score),
        "risk_level": risk,
        "flags": flags,
        "nudge_intensity_recommended": intensity,
        "invest_multiplier": invest_multiplier
    }

@app.post("/predict")
def predict_overspending(req: PredictRequest):
    if 'pred_scaler' not in models or 'predictor' not in models:
        raise HTTPException(status_code=503, detail="Predictor models not loaded")
        
    is_monday = 1 if req.day_of_week == 0 else 0
    
    features = [[
        req.morning_spend, req.day_of_week, req.yesterday_total,
        req.rolling_7day_avg, req.payday_proximity, req.budget_remaining_percent,
        req.last_week_same_day, is_monday
    ]]
    
    scaled = models['pred_scaler'].transform(features)
    pred_class = models['predictor'].predict(scaled)[0]
    probs = models['predictor'].predict_proba(scaled)[0]
    
    overspend_prob = probs[1]
    
    risk = "high" if overspend_prob > 0.6 else "low"
    action = "activate_moderate_nudges" if risk == "high" else "none"
    
    flags = []
    if is_monday: flags.append("monday_spike_detected")
    if req.yesterday_total > req.rolling_7day_avg: flags.append("yesterday_overspent")
    
    return {
        "predicted_daily_spend": float(req.yesterday_total * 1.1), # simple mock projection
        "overspend_probability": float(overspend_prob),
        "risk_level": risk,
        "top_risk_factors": flags,
        "recommended_action": action
    }

@app.get("/cluster/{user_id}")
def get_cluster(user_id: str):
    # In reality, this queries MongoDB for pre-calculated features
    # Since blueprint says "GET /cluster/:userId Response: {cluster_id, label...}"
    # We mock retrieval based on known seeded demo users
    
    if user_id == 'usr_ravi':
        return {
          "cluster_id": 1,
          "personality_type": "midnight_impulse_buyer",
          "personality_label": "Midnight Impulse Buyer",
          "confidence": 0.84,
          "dominant_traits": ["high_night_spend", "food_heavy"]
        }
    elif user_id == 'usr_karan':
        return {
          "cluster_id": 2,
          "personality_type": "stress_spender",
          "personality_label": "Stress Spender",
          "confidence": 0.88,
          "dominant_traits": ["monday_spikes", "shopping_heavy"]
        }
    else:
        return {
          "cluster_id": 0,
          "personality_type": "controlled",
          "personality_label": "Controlled Spender",
          "confidence": 0.92,
          "dominant_traits": ["under_budget", "low_variance"]
        }
