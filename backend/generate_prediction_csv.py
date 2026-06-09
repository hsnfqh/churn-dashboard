import pandas as pd
import joblib

print("Loading dataset...")

# Dataset asli
df = pd.read_csv("churn_dataset.csv")

# Simpan copy
original_df = df.copy()

print("Loading model...")
model = joblib.load("model/xgboost_churn_model.joblib")
scaler = joblib.load("model/scaler.joblib")
feature_columns = joblib.load("model/feature_columns.joblib")

# Hapus target jika ada
if "Churned" in df.columns:
    df = df.drop(columns=["Churned"])

print("Encoding...")

# One Hot Encoding
df_encoded = pd.get_dummies(
    df,
    columns=["Gender", "Country", "City", "Signup_Quarter"]
)

# Samakan kolom dengan model
for col in feature_columns:
    if col not in df_encoded.columns:
        df_encoded[col] = 0

df_encoded = df_encoded[feature_columns]

print("Scaling...")
X_scaled = scaler.transform(df_encoded)

print("Predicting...")

# Prediksi
predictions = model.predict(X_scaled)

# Probabilitas
probabilities = model.predict_proba(X_scaled)[:, 1] * 100

# Tambahkan ke dataset asli
original_df["Prediction"] = predictions
original_df["Probability"] = probabilities.round(2)

# Risk Level
def risk(prob):
    if prob >= 70:
        return "High Risk"
    elif prob >= 40:
        return "Medium Risk"
    else:
        return "Low Risk"

original_df["Risk_Level"] = (
    original_df["Probability"]
    .apply(risk)
)

# Simpan
output_file = "churn_prediction_prediction.csv"

original_df.to_csv(
    output_file,
    index=False
)

print(f"Done! File saved as {output_file}")