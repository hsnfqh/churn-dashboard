import joblib

cols = joblib.load("model/feature_columns.joblib")

print("Jumlah:", len(cols))

for c in cols:
    print(c)