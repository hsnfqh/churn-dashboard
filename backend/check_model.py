import joblib

model = joblib.load("model/xgboost_churn_model.joblib")

print(type(model))
print("Jumlah fitur:", model.n_features_in_)