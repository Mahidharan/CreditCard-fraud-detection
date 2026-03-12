from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

app = FastAPI(title="Fraud Detection API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
model_path = os.path.join(os.path.dirname(__file__), 'ml_model', 'knn_model.pkl')
try:
    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)
        knn_model = model_data['model']
        scaler = model_data['scaler']
        features = model_data['features']
except FileNotFoundError:
    print("Warning: Model file not found. Make sure to train it first.")
    knn_model = None
    scaler = None

# MongoDB Connection
MONGO_DETAILS = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.fraud_detection_db
transaction_collection = database.get_collection("transactions")

# Pydantic Models for Input Validation
class TransactionInput(BaseModel):
    amount: float
    transaction_time: int
    merchant_category: int
    distance_from_home: float
    transaction_location: str = "Unknown"
    device_type: str = "Unknown"

class PredictionOutput(BaseModel):
    prediction: str
    risk_score: float

@app.post("/predict", response_model=PredictionOutput)
async def predict_fraud(transaction: TransactionInput):
    if knn_model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")
        
    # Extract features for prediction
    input_data = np.array([[
        transaction.amount,
        transaction.transaction_time,
        transaction.merchant_category,
        transaction.distance_from_home
    ]])
    
    scaled_data = scaler.transform(input_data)
    
    # Predict
    prediction_result = knn_model.predict(scaled_data)[0]
    
    # Get risk score (probability of class 1 / fraud)
    probabilities = knn_model.predict_proba(scaled_data)[0]
    risk_score = round(float(probabilities[1]), 4)
    
    prediction_label = "Fraudulent" if prediction_result == 1 else "Legitimate"
    
    # Save to MongoDB
    transaction_doc = transaction.model_dump()
    transaction_doc["prediction"] = prediction_label
    transaction_doc["risk_score"] = risk_score
    transaction_doc["timestamp"] = datetime.now()
    
    result = await transaction_collection.insert_one(transaction_doc)
    transaction_doc["_id"] = str(result.inserted_id)
    
    return {"prediction": prediction_label, "risk_score": risk_score, "transaction_id": str(result.inserted_id)}

@app.get("/transactions")
async def get_transactions(limit: int = 100):
    transactions = []
    cursor = transaction_collection.find().sort("timestamp", -1).limit(limit)
    async for document in cursor:
        document["_id"] = str(document["_id"])
        transactions.append(document)
    return transactions

@app.get("/analytics")
async def get_analytics():
    total_transactions = await transaction_collection.count_documents({})
    fraudulent_transactions = await transaction_collection.count_documents({"prediction": "Fraudulent"})
    safe_transactions = total_transactions - fraudulent_transactions
    
    risk_percentage = (fraudulent_transactions / total_transactions * 100) if total_transactions > 0 else 0
    
    # Fetch a sample of latest transactions for trend charting (e.g. by hour)
    pipeline = [
        {"$group": {
            "_id": "$transaction_time", 
            "total": {"$sum": 1},
            "fraud": {"$sum": {"$cond": [{"$eq": ["$prediction", "Fraudulent"]}, 1, 0]}}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    hourly_trends = []
    async for doc in transaction_collection.aggregate(pipeline):
        hourly_trends.append({
            "hour": doc["_id"],
            "total": doc["total"],
            "fraud": doc["fraud"]
        })
        
    return {
        "summary": {
            "total_transactions": total_transactions,
            "fraudulent_transactions": fraudulent_transactions,
            "safe_transactions": safe_transactions,
            "fraud_risk_percentage": round(risk_percentage, 2)
        },
        "hourly_trends": hourly_trends
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
