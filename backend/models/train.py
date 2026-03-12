import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

def train_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, '..', 'dataset', 'creditcard.csv')
    
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}")
        return
        
    df = pd.DataFrame(pd.read_csv(data_path))
    
    # We use these exact features in the predict endpoint payload
    features = ['amount', 'transaction_time', 'merchant_category', 'distance_from_home']
    X = df[features]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features since KNN is distance-based
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train KNN Model
    knn = KNeighborsClassifier(n_neighbors=5, weights='distance')
    knn.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = knn.predict(X_test_scaled)
    print("--- Model Accuracy ---")
    print(accuracy_score(y_test, y_pred))
    print("\n--- Classification Report ---")
    print(classification_report(y_test, y_pred))
    
    # Save model and scaler
    model_dir = os.path.join(base_dir, 'ml_model')
    os.makedirs(model_dir, exist_ok=True)
    
    with open(os.path.join(model_dir, 'knn_model.pkl'), 'wb') as f:
        pickle.dump({'model': knn, 'scaler': scaler, 'features': features}, f)
        
    print(f"\nModel & Scaler successfully saved to {os.path.join(model_dir, 'knn_model.pkl')}")

if __name__ == "__main__":
    train_model()
