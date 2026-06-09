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
# TEMP STORAGE
# =========================

predicted_customers = []

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
# GET ALL PREDICTED CUSTOMERS
# =========================

@app.get("/customers")
def get_customers():
    return predicted_customers


# =========================
# PREDICT ENDPOINT
# =========================

@app.post("/predict")
def predict(data: PredictionInput):

    input_data = data.dict()

    # =========================
    # PREPROCESS
    # =========================

    df = pd.DataFrame([input_data])

    df_encoded = pd.get_dummies(df)

    df_encoded = df_encoded.reindex(
        columns=feature_columns,
        fill_value=0
    )

    scaled_data = scaler.transform(df_encoded)

    # =========================
    # PREDICTION
    # =========================

    probability = float(
        model.predict_proba(scaled_data)[0][1]
    )

    prediction = int(probability >= 0.5)

    probability_percent = round(
        probability * 100,
        2
    )

    # =========================
    # RISK LEVEL
    # =========================

    if probability >= 0.70:
        risk_level = "HIGH RISK"

    elif probability >= 0.40:
        risk_level = "MEDIUM RISK"

    else:
        risk_level = "LOW RISK"

    # =========================
    # CAUSE ANALYSIS
    # =========================

    causes = []

    if data.Login_Frequency < 10:
        causes.append("Frekuensi login rendah")

    if data.Session_Duration_Avg < 25:
        causes.append("Durasi sesi pendek")

    if data.Customer_Service_Calls > 5:
        causes.append("Panggilan customer service tinggi")

    if data.Days_Since_Last_Purchase > 30:
        causes.append("Sudah lama tidak melakukan pembelian")

    if data.Cart_Abandonment_Rate > 50:
        causes.append("Tingkat cart abandonment tinggi")

    if data.Lifetime_Value < 1000:
        causes.append("Lifetime value rendah")

    if len(causes) == 0:
        cause = (
            "Tidak ditemukan faktor risiko dominan. "
            "Pelanggan menunjukkan perilaku yang relatif stabil."
        )
    else:
        cause = ", ".join(causes)

    # =========================
    # RECOMMENDATION
    # =========================

    if probability >= 0.70:

        recommendation = (
            "Prioritaskan pelanggan ini untuk program retensi. "
            "Berikan promosi personal, loyalty reward, dan "
            "follow-up aktif dari tim customer success."
        )

    elif probability >= 0.40:

        recommendation = (
            "Tingkatkan engagement pelanggan melalui email marketing, "
            "voucher diskon, dan rekomendasi produk yang relevan."
        )

    else:

        recommendation = (
            "Pelanggan berada pada risiko churn yang rendah. "
            "Pertahankan kualitas layanan dan lakukan monitoring berkala."
        )

    # =========================
    # SAVE CUSTOMER RESULT
    # =========================

    customer_result = {
        **input_data,
        "prediction": prediction,
        "probability": probability_percent,
        "level": risk_level,
        "cause": cause,
        "recommendation": recommendation
    }

    predicted_customers.append(customer_result)

    # =========================
    # RESPONSE
    # =========================

    return customer_result