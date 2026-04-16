import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

def train_categoriser():
    print("Loading data...")
    # Load dataset
    df = pd.read_csv('../../data/merchants_labeled.csv')
    
    # Preprocess
    df['merchant_name'] = df['merchant_name'].str.lower().str.replace(r'[^\w\s]', '', regex=True)
    
    # Vectorize
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
    X = vectorizer.fit_transform(df['merchant_name'])
    y = df['category']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    print("Training Logistic Regression Model...")
    model = LogisticRegression(class_weight='balanced', random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    
    # Evaluate
    print("Evaluation:")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    # Save
    os.makedirs('../models', exist_ok=True)
    joblib.dump(vectorizer, '../models/tfidf_vectorizer.pkl')
    joblib.dump(model, '../models/categoriser.pkl')
    print("Models saved to ../models/")

if __name__ == "__main__":
    train_categoriser()
