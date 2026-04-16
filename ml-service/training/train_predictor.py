import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import joblib
import os
import random

def generate_synthetic_predictor_data(num_samples=1000):
    data = []
    for _ in range(num_samples):
        # 8AM Snapshot Features
        morning_spend = random.randint(0, 500)
        day_of_week = random.randint(0, 6)
        yesterday_total = random.randint(100, 2000)
        rolling_7day_avg = random.randint(300, 1500)
        payday_prox = random.randint(0, 30)
        budget_rem = round(random.uniform(0.0, 1.0), 2)
        last_week_same_day = random.randint(100, 2000)
        is_monday = 1 if day_of_week == 0 else 0
        
        # Logic to decide "will_overspend" (rule-based synthetic target)
        stress_score = 0
        if is_monday: stress_score += 2
        if payday_prox <= 3: stress_score += 2
        if morning_spend > 200: stress_score += 1
        if budget_rem < 0.3: stress_score += 2
        if yesterday_total > 1500: stress_score += 1
        
        will_overspend = 1 if stress_score >= 4 else 0
        
        data.append([
            morning_spend, day_of_week, yesterday_total, rolling_7day_avg,
            payday_prox, budget_rem, last_week_same_day, is_monday, will_overspend
        ])
    
    return pd.DataFrame(data, columns=[
        'morning_spend_so_far', 'day_of_week', 'yesterday_total_spend',
        'rolling_7day_avg', 'payday_proximity', 'budget_remaining_percent',
        'last_week_same_day_spend', 'is_monday', 'will_overspend'
    ])

def train_predictor():
    print("Generating synthetic predictor training data...")
    df = generate_synthetic_predictor_data(num_samples=1500)
    
    X = df.drop('will_overspend', axis=1)
    y = df['will_overspend']
    
    print("Scaling...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)
    
    print("Evaluation:")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    # Save
    os.makedirs('../models', exist_ok=True)
    joblib.dump(scaler, '../models/scaler.pkl')
    joblib.dump(model, '../models/predictor.pkl')
    print("Models saved to ../models/")

if __name__ == "__main__":
    train_predictor()
