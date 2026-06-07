import { Cpu, RefreshCw } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";

export default function PredictionPage({
  formData,
  setFormData,
  onPredict,
  predicting,
  result,
  isMobile,
  themeColors
}) {
  const set = (k, v) =>
    setFormData((prev) => ({
      ...prev,
      [k]: v
    }));

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: themeColors.inputBg,
    border: `1px solid ${themeColors.inputBorder}`,
    borderRadius: 10,
    color: themeColors.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box"
  };

  const labelStyle = {
    color: themeColors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    display: "block"
  };

  const fieldGroup = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: 14
  };

  const riskColor =
    result?.level === "HIGH RISK"
      ? "#ef4444"
      : result?.level === "MEDIUM RISK"
      ? "#f59e0b"
      : "#10b981";

  const riskBg =
    result?.level === "HIGH RISK"
      ? "rgba(239,68,68,0.1)"
      : result?.level === "MEDIUM RISK"
      ? "rgba(245,158,11,0.1)"
      : "rgba(16,185,129,0.1)";

  return (
    <div style={{ maxWidth: 1100 }}>
      <SectionTitle
        isMobile={isMobile}
        themeColors={themeColors}
        sub="Prediksi kemungkinan pelanggan berhenti menggunakan layanan"
      >
        Prediksi Churn Pelanggan
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            result && !isMobile ? "1.2fr 0.8fr" : "1fr",
          gap: 20
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* DATA PELANGGAN */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              👤 Data Pelanggan
            </h3>

            <div style={fieldGroup}>
              <div>
                <label style={labelStyle}>Umur</label>
                <input
                  type="number"
                  value={formData.Age}
                  onChange={(e) => set("Age", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Jenis Kelamin</label>
                <select
                  value={formData.Gender}
                  onChange={(e) => set("Gender", e.target.value)}
                  style={inputStyle}
                >
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Negara</label>
                <input
                  value={formData.Country}
                  onChange={(e) => set("Country", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kota</label>
                <input
                  value={formData.City}
                  onChange={(e) => set("City", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kuartal Pendaftaran</label>
                <select
                  value={formData.Signup_Quarter}
                  onChange={(e) =>
                    set("Signup_Quarter", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* AKTIVITAS */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              📈 Aktivitas Pengguna
            </h3>

            <div style={fieldGroup}>
              {[
                ["Membership_Years", "Lama Berlangganan"],
                ["Login_Frequency", "Frekuensi Login"],
                ["Session_Duration_Avg", "Durasi Sesi Rata-rata"],
                ["Pages_Per_Session", "Halaman per Sesi"],
                ["Mobile_App_Usage", "Penggunaan Mobile App"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* BELANJA */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              🛒 Aktivitas Belanja
            </h3>

            <div style={fieldGroup}>
              {[
                ["Total_Purchases", "Total Pembelian"],
                ["Average_Order_Value", "Nilai Order Rata-rata"],
                ["Wishlist_Items", "Jumlah Wishlist"],
                ["Cart_Abandonment_Rate", "Cart Abandonment (%)"],
                ["Days_Since_Last_Purchase", "Hari Sejak Pembelian Terakhir"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* LOYALITAS */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              💰 Loyalitas & Nilai Pelanggan
            </h3>

            <div style={fieldGroup}>
              {[
                ["Lifetime_Value", "Lifetime Value"],
                ["Credit_Balance", "Saldo Kredit"],
                ["Discount_Usage_Rate", "Penggunaan Diskon (%)"],
                ["Returns_Rate", "Tingkat Retur (%)"],
                ["Email_Open_Rate", "Email Open Rate (%)"],
                ["Customer_Service_Calls", "Panggilan Customer Service"],
                ["Product_Reviews_Written", "Review Produk"],
                ["Social_Media_Engagement_Score", "Engagement Sosial"],
                ["Payment_Method_Diversity", "Variasi Metode Pembayaran"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          <button
            onClick={onPredict}
            disabled={predicting}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)",
              color: "#fff",
              fontWeight: 700,
              cursor: predicting ? "not-allowed" : "pointer"
            }}
          >
            {predicting ? (
              <>
                <RefreshCw
                  size={18}
                  style={{
                    animation: "spin 1s linear infinite"
                  }}
                />
                {" "}Menganalisis...
              </>
            ) : (
              <>
                <Cpu size={18} /> Prediksi Risiko Churn
              </>
            )}
          </button>
        </div>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <GlassCard isMobile={isMobile} themeColors={themeColors}>
              <div style={{ textAlign: "center" }}>

                <h3 style={{ marginBottom: 20 }}>
                  Hasil Prediksi
                </h3>

                <div
                  style={{
                    position: "relative",
                    width: 180,
                    height: 180,
                    margin: "0 auto 20px"
                  }}
                >
                  <svg viewBox="0 0 180 180">
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      fill="none"
                      stroke={themeColors.inputBorder}
                      strokeWidth="12"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      fill="none"
                      stroke={riskColor}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${
                        (2 * Math.PI * 75 * result.probability) / 100
                      } ${2 * Math.PI * 75}`}
                      transform="rotate(-90 90 90)"
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      style={{
                        fontSize: 38,
                        fontWeight: 800,
                        color: riskColor
                      }}
                    >
                      {result.probability}%
                    </div>

                    <div
                      style={{
                        color: themeColors.textMuted,
                        fontSize: 12
                      }}
                    >
                      Risiko Churn
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    borderRadius: 999,
                    background: riskBg,
                    color: riskColor,
                    fontWeight: 700
                  }}
                >
                  {result.level}
                </div>

                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8
                    }}
                  >
                    <span>Skor Risiko</span>
                    <span>{result.probability}%</span>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: themeColors.inputBorder,
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${result.probability}%`,
                        height: "100%",
                        background: riskColor
                      }}
                    />
                  </div>
                </div>

                <p
                  style={{
                    marginTop: 20,
                    color: themeColors.textSecondary
                  }}
                >
                  {result.cause}
                </p>
              </div>
            </GlassCard>

          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}