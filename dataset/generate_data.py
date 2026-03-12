import pandas as pd
import numpy as np
import random
import os

def generate_synthetic_data(num_samples=5000):
    np.random.seed(42)
    random.seed(42)
    
    data = []
    
    for i in range(num_samples):
        # Base features
        amount = round(np.random.exponential(scale=50) + 1, 2)
        transaction_time = np.random.randint(0, 24)
        merchant_category = np.random.randint(1, 6)
        distance_from_home = round(np.random.exponential(scale=10), 2)
        
        # Fraud logic
        is_fraud = 0
        fraud_prob = 0.01 # Base fraud probability
        
        # Increase fraud probability based on risk factors
        if amount > 500:
            fraud_prob += 0.3
        if transaction_time >= 1 and transaction_time <= 5: # Night time transactions
            fraud_prob += 0.2
        if distance_from_home > 100:
            fraud_prob += 0.3
            
        if random.random() < fraud_prob:
            is_fraud = 1
            # Boost amount and distance for fraudulent transactions to make it clearer for KNN
            amount += np.random.uniform(200, 1500)
            distance_from_home += np.random.uniform(50, 500)
            
        data.append({
            'transaction_id': f"TXN{i:05d}",
            'amount': round(amount, 2),
            'transaction_time': transaction_time,
            'merchant_category': merchant_category,
            'distance_from_home': round(distance_from_home, 2),
            'is_fraud': is_fraud
        })
        
    df = pd.DataFrame(data)
    
    # Save to dataset folder
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'creditcard.csv')
    df.to_csv(file_path, index=False)
    print(f"Generated {num_samples} samples. Saved to {file_path}")
    print("\nFraud vs Legitimate breakdown:")
    print(df['is_fraud'].value_counts())

if __name__ == "__main__":
    generate_synthetic_data()
