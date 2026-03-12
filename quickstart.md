# Quickstart Guide

This guide will help you set up and run the **Credit Card Fraud Detection System** on a completely new system.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Python** (v3.9 or higher) - [Download here](https://www.python.org/)
3. **MongoDB** (Local instance running on `localhost:27017`) - [Download here](https://www.mongodb.com/try/download/community)

---

## 1. Project Initialization

Clone or extract the project folder `fraud-detection-system`.

Open a terminal in the root directory:
```bash
cd path/to/fraud-detection-system
```

---

## 2. Backend Setup & Machine Learning

Open a new terminal window to set up the Python backend environment and train the KNN model.

### 2.1 Set up Virtual Environment
```bash
cd backend
python -m venv venv
```

### 2.2 Activate Virtual Environment
- **Windows:**
  ```powershell
  .\venv\Scripts\activate
  ```
- **Mac / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2.4 Generate Dataset & Train the Model
This step creates synthetic transaction data and trains the K-Nearest Neighbors (KNN) Machine Learning model.

From inside the `backend` directory (with the virtual environment activated), run:
```bash
# 1. Generate the synthetic dataset (creates creditcard.csv)
python ../dataset/generate_data.py

# 2. Train the KNN model (creates ml_model/knn_model.pkl)
python models/train.py
```

### 2.5 Start the Backend API Server
Ensure your local **MongoDB server is running** (default port `27017`), then start the FastAPI application:

```bash
python app.py
```
*The backend API will start running at `http://localhost:8000`.*
*Interactive API docs available at `http://localhost:8000/docs`.*

---

## 3. Frontend Setup

Open an entirely **new terminal window** (keep the backend terminal running).

### 3.1 Install React Dependencies
```bash
cd path/to/fraud-detection-system/frontend
npm install
```

### 3.2 Run the Frontend Server
```bash
npm run dev
```

The frontend application will start up. Click the link provided in the terminal (usually `http://localhost:5173`) to open the app in your browser!

## Troubleshooting

- **Blank screen on frontend?** Ensure you ran `npm install` inside the frontend directory before running `npm run dev`.
- **Backend Model not found error?** Always run `python models/train.py` before starting the server.
- **Backend MongoDB connection error?** Ensure MongoDB Community Server is installed and running on your system.
