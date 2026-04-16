import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import joblib
import os
import random

def generate_synthetic_cluster_data(num_users=300):
    # Cluster 0: Controlled, Cluster 1: Midnight Impulse, Cluster 2: Stress
    data = []
    
    for _ in range(num_users):
        cluster_type = random.choice([0, 1, 2])
        
        if cluster_type == 0: # Controlled Spender
            total = random.randint(200, 800)
            txn_cnt = random.randint(1, 3)
            night_ratio = random.uniform(0.0, 0.2)
            weekend_ratio = random.uniform(0.1, 0.3)
            food_ratio = random.uniform(0.1, 0.3)
            impulse = random.uniform(1.0, 4.0)
            payday = random.randint(5, 25)
            sub_ratio = random.uniform(0.1, 0.4)
        elif cluster_type == 1: # Midnight Impulse Buy
            total = random.randint(800, 2000)
            txn_cnt = random.randint(3, 7)
            night_ratio = random.uniform(0.5, 0.9)
            weekend_ratio = random.uniform(0.2, 0.5)
            food_ratio = random.uniform(0.4, 0.8)
            impulse = random.uniform(6.0, 9.5)
            payday = random.randint(0, 30)
            sub_ratio = random.uniform(0.0, 0.1)
        else: # Stress Spender
            total = random.randint(1500, 4000)
            txn_cnt = random.randint(4, 9)
            night_ratio = random.uniform(0.2, 0.5)
            weekend_ratio = random.uniform(0.6, 0.9) # High weekend/monday
            food_ratio = random.uniform(0.2, 0.4)
            impulse = random.uniform(5.0, 8.0)
            payday = random.randint(0, 5) # Close to payday
            sub_ratio = random.uniform(0.05, 0.15)
            
        data.append([
            total, txn_cnt, night_ratio, weekend_ratio,
            food_ratio, impulse, payday, sub_ratio
        ])
        
    return pd.DataFrame(data, columns=[
        'total_spent', 'num_transactions', 'night_spend_ratio', 'weekend_spend_ratio',
        'food_ratio', 'impulse_score', 'payday_proximity', 'subscription_ratio'
    ])

def train_clusterer():
    print("Generating synthetic clustering data...")
    df = generate_synthetic_cluster_data(500)
    
    print("Scaling and PCA...")
    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)
    
    # PCA to 5 components
    pca = PCA(n_components=5)
    X_pca = pca.fit_transform(X_scaled)
    
    print("Training KMeans (k=3)...")
    kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
    kmeans.fit(X_pca)
    
    # Save
    os.makedirs('../models', exist_ok=True)
    joblib.dump(scaler, '../models/cluster_scaler.pkl')
    joblib.dump(pca, '../models/pca.pkl')
    joblib.dump(kmeans, '../models/clusterer.pkl')
    
    print("Models saved to ../models/")
    
if __name__ == "__main__":
    train_clusterer()
