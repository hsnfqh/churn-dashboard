from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib

# =========================
# FASTAPI APP
# =========================

app = FastAPI(title="Customer Churn Prediction API")

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD MODEL
# =========================

model = joblib.load("model/xgboost_churn_model.joblib")
scaler = joblib.load("model/scaler.joblib")
feature_columns = joblib.load("model/feature_columns.joblib")

# =========================
# INPUT SCHEMA
# =========================

class PredictionInput(BaseModel):
    Age: float
    Membership_Years: float
    Login_Frequency: float
    Session_Duration_Avg: float
    Pages_Per_Session: float
    Cart_Abandonment_Rate: float
    Wishlist_Items: float
    Total_Purchases: float
    Average_Order_Value: float
    Days_Since_Last_Purchase: float
    Discount_Usage_Rate: float
    Returns_Rate: float
    Email_Open_Rate: float
    Customer_Service_Calls: float
    Product_Reviews_Written: float
    Social_Media_Engagement_Score: float
    Mobile_App_Usage: float
    Payment_Method_Diversity: float
    Lifetime_Value: float
    Credit_Balance: float

    Gender: str
    Country: str
    City: str
    Signup_Quarter: str


# =========================
# ROOT ENDPOINT
# =========================

@app.get("/")
def root():
    return {
        "message": "Customer Churn Prediction API Running",
        "features": len(feature_columns)
    }


# =========================
# PREDICT ENDPOINT
# =========================

@app.post("/predict")
def predict(data: PredictionInput):

    input_data = data.dict()

    # dataframe dari input user
    df = pd.DataFrame([input_data])

    # one hot encoding
    df_encoded = pd.get_dummies(df)

    # samakan kolom dengan training
    df_encoded = df_encoded.reindex(
        columns=feature_columns,
        fill_value=0
    )

    # scaling
    scaled_data = scaler.transform(df_encoded)

    # prediksi probabilitas churn
    probability = float(
        model.predict_proba(scaled_data)[0][1]
    )

    prediction = int(probability >= 0.5)

    # risk level
    if probability >= 0.70:
        risk_level = "HIGH RISK"
    elif probability >= 0.40:
        risk_level = "MEDIUM RISK"
    else:
        risk_level = "LOW RISK"

    return {
        "prediction": prediction,
        "probability": round(probability * 100, 2),
        "risk_level": risk_level
    }