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

  const placeholders = {
    Customer_Name: "Contoh: Ardien",
    Age: "Contoh: 25",
    Country: "Contoh: Indonesia",
    City: "Contoh: Bogor",

    Membership_Years: "Contoh: 2",
    Login_Frequency: "Contoh: 20",
    Session_Duration_Avg: "Contoh: 30",
    Pages_Per_Session: "Contoh: 5",
    Mobile_App_Usage: "Contoh: 80",

    Total_Purchases: "Contoh: 15",
    Average_Order_Value: "Contoh: 500000",
    Wishlist_Items: "Contoh: 3",
    Cart_Abandonment_Rate: "Contoh: 20",
    Days_Since_Last_Purchase: "Contoh: 7",

    Lifetime_Value: "Contoh: 5000000",
    Credit_Balance: "Contoh: 100000",
    Discount_Usage_Rate: "Contoh: 30",
    Returns_Rate: "Contoh: 5",
    Email_Open_Rate: "Contoh: 60",
    Customer_Service_Calls: "Contoh: 2",
    Product_Reviews_Written: "Contoh: 5",
    Social_Media_Engagement_Score: "Contoh: 75",
    Payment_Method_Diversity: "Contoh: 2"
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
        sub="Isi data pelanggan untuk mengetahui kemungkinan pelanggan berhenti menggunakan layanan."
      >
        Prediksi Risiko Churn Pelanggan
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

          <GlassCard
            isMobile={isMobile}
            themeColors={themeColors}
          >
            <p
              style={{
                margin: 0,
                color: themeColors.textSecondary,
                lineHeight: 1.7,
                fontSize: 14
              }}
            >
              Isi data pelanggan di bawah ini, lalu klik
              <strong> "Prediksi Risiko Churn"</strong>
              untuk melihat tingkat risiko pelanggan berhenti menggunakan layanan
              beserta rekomendasi tindakan yang dapat dilakukan.
            </p>
          </GlassCard>

          {/* Profil Pelanggan */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              👤 Profil Pelanggan
            </h3>

            <div style={fieldGroup}>
              <div>
                <label style={labelStyle}>Nama Pelanggan</label>
                <input
                  value={formData.Customer_Name || ""}
                  placeholder={placeholders.Customer_Name}
                  onChange={(e) => set("Customer_Name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Usia Pelanggan</label>
                <input
                  type="number"
                  value={formData.Age}
                  placeholder={placeholders.Age}
                  onChange={(e) => set("Age", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Jenis Kelamin</label>
                <select
                  value={formData.Gender}
                  placeholder={placeholders.Gender}
                  onChange={(e) => set("Gender", e.target.value)}
                  style={inputStyle}
                >
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Negara Domisili</label>
                <input
                  value={formData.Country}
                  placeholder={placeholders.Country}
                  onChange={(e) => set("Country", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kota Domisili</label>
                <input
                  value={formData.City}
                  placeholder={placeholders.City}
                  onChange={(e) => set("City", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Periode Bergabung</label>
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
              📱 Aktivitas Penggunaan Layanan
            </h3>

            <div style={fieldGroup}>
              {[
                ["Membership_Years","Lama Menjadi Pelanggan (tahun)"],
                ["Login_Frequency","Jumlah Login per Bulan"],
                ["Session_Duration_Avg","Rata-rata Waktu Penggunaan (menit)"],
                ["Pages_Per_Session","Halaman yang Dilihat per Kunjungan"],
                ["Mobile_App_Usage","Tingkat Penggunaan Aplikasi (%)"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholders[key]}
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
                ["Total_Purchases","Total Transaksi"],
                ["Average_Order_Value","Rata-rata Nilai Belanja"],
                ["Wishlist_Items","Produk dalam Wishlist"],
                ["Cart_Abandonment_Rate","Keranjang Tidak Diselesaikan (%)"],
                ["Days_Since_Last_Purchase","Hari Sejak Transaksi Terakhir"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholders[key]}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* LOYALITAS */}
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#60a5fa", marginBottom: 16 }}>
              ⭐ Loyalitas dan Interaksi Pelanggan
            </h3>

            <div style={fieldGroup}>
              {[
                ["Lifetime_Value","Total Nilai Pelanggan"],
                ["Credit_Balance","Saldo Kredit"],
                ["Discount_Usage_Rate","Penggunaan Voucher/Diskon (%)"],
                ["Returns_Rate","Persentase Pengembalian Barang"],
                ["Email_Open_Rate","Email yang Dibuka (%)"],
                ["Customer_Service_Calls","Jumlah Keluhan ke Customer Service"],
                ["Product_Reviews_Written","Jumlah Review yang Diberikan"],
                ["Social_Media_Engagement_Score","Aktivitas di Media Sosial"],
                ["Payment_Method_Diversity","Jumlah Metode Pembayaran yang Digunakan"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholders[key]}
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
                <Cpu size={18} /> Prediksi Risiko Pelanggan
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
                      Kemungkinan Berhenti Berlangganan
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
                    <span>Tingkat Risiko</span>
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

                <div
                  style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)"
                  }}
                >
                  <h4
                    style={{
                      color: "#60a5fa",
                      marginBottom: 8
                    }}
                  >
                    Rekomendasi Tindakan
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      color: themeColors.textSecondary,
                      lineHeight: 1.6
                    }}
                  >
                    {result.recommendation}
                  </p>
                </div>
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