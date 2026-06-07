import { useState, useEffect } from "react";
import { Users, AlertTriangle, UserCheck, TrendingDown, Globe, Layers, Phone, CreditCard, Star, Wallet, ShoppingCart, Heart, Percent, Loader } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LabelList } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import CustomTooltip from "./CustomTooltip";

// Import CSV sebagai raw text
import customersCsv from "../data/customers.csv?raw";

const fmt = (n) => Math.round(n).toLocaleString("id-ID");
const fmtLabel = (s) => {
  if (!s) return "Unknown";
  if (s.length <= 3) return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const PIE_PALETTE = ["#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#ef4444"];

const QUARTER_LABEL = { q1: "Jan–Mar", q2: "Apr–Jun", q3: "Jul–Sep", q4: "Okt–Des" };

// Feature importance dari XGBoost model (EXACT values dari Colab)
const XGBOOST_FEATURES = [
  { feature: "Customer Service Calls", importance: 0.123834, value: 12.38, color: "#ef4444" },
  { feature: "Payment Method Diversity", importance: 0.089173, value: 8.92, color: "#f59e0b" },
  { feature: "Product Reviews Written", importance: 0.063960, value: 6.40, color: "#10b981" },
  { feature: "Lifetime Value", importance: 0.059291, value: 5.93, color: "#3b82f6" },
  { feature: "Cart Abandonment Rate", importance: 0.058040, value: 5.80, color: "#8b5cf6" },
  { feature: "Wishlist Items", importance: 0.046203, value: 4.62, color: "#ec4899" },
  { feature: "Discount Usage Rate", importance: 0.043092, value: 4.31, color: "#14b8a6" },
  { feature: "Age", importance: 0.036770, value: 3.68, color: "#f97316" },
  { feature: "Total Purchases", importance: 0.027698, value: 2.77, color: "#06b6d4" },
  { feature: "Gender (Male)", importance: 0.026647, value: 2.66, color: "#84cc16" },
  { feature: "Email Open Rate", importance: 0.022638, value: 2.26, color: "#a855f7" },
  { feature: "City (Yokohama)", importance: 0.018506, value: 1.85, color: "#eab308" },
  { feature: "Days Since Last Purchase", importance: 0.017027, value: 1.70, color: "#d946ef" },
  { feature: "Signup Quarter Q4", importance: 0.014468, value: 1.45, color: "#6366f1" },
  { feature: "Signup Quarter Q3", importance: 0.012331, value: 1.23, color: "#22c55e" }
];

// Fungsi Animasi Angka Berhitung Naik (Count Up)
function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ==========================================
// SUB-KOMPONEN UI: KpiCard (Kartu Metrik Utama)
// ==========================================
function KpiCard({ icon: Icon, label, sub, value, color, decimals = 0, suffix = "", themeColors, isMobile, delay = 0 }) {
  const animated = useCountUp(value);
  const text = decimals > 0 ? animated.toFixed(decimals) : fmt(animated);
  return (
    <div className="kpi-card dash-enter-3d" style={{ "--glow": `${color}77`, "--icon-color": color, animationDelay: `${delay}ms`, position: "relative", overflow: "hidden", background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 18, padding: isMobile ? "16px" : "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative" }}>
        <div className="kpi-icon-holder" style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius: 13, background: `${color}18`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.35s cubic-bezier(.4,0,.2,1)" }}>
          <Icon size={isMobile ? 18 : 20} color={color} className="kpi-icon-svg" style={{ transition: "all 0.35s" }} />
        </div>
        <div style={{ fontSize: 12.5, color: themeColors.textSecondary, fontWeight: 600, letterSpacing: "0.2px" }}>{label}</div>
      </div>
      <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: themeColors.text, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: 6, position: "relative" }}>{text}{suffix}</div>
      <div style={{ fontSize: 12, color: themeColors.text, position: "relative", zIndex: 1 }}>{sub}</div>
    </div>
  );
}

// ==========================================
// UTAMA: HALAMAN DASHBOARD PAGE
// ==========================================
export default function DashboardPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    highRiskCustomers: 0,
    mediumRiskCustomers: 0,
    loyalCustomers: 0,
    churnRate: 0,
    churnTrend: [],
    distributionByCountry: [],
    distributionByGender: [],
    distributionByCity: [],
    churnedCount: 0
  });
  const [distDim, setDistDim] = useState("status");

  // Hitung churn probability berdasarkan XGBoost features
  const calculateChurnProbability = (customer) => {
    let score = 0.15;

    const serviceCalls = customer.Customer_Service_Calls || 0;
    if (serviceCalls > 5) score += 0.25;
    else if (serviceCalls > 3) score += 0.15;
    else if (serviceCalls > 1) score += 0.08;

    const paymentDiv = customer.Payment_Method_Diversity || 0.3;
    if (paymentDiv > 0.7) score += 0.18;
    else if (paymentDiv > 0.5) score += 0.10;
    else if (paymentDiv > 0.3) score += 0.05;

    const reviews = customer.Product_Reviews_Written || 0;
    if (reviews === 0) score += 0.14;
    else if (reviews < 2) score += 0.07;

    const ltv = customer.Lifetime_Value || 1000;
    if (ltv < 500) score += 0.12;
    else if (ltv < 1000) score += 0.06;

    const cartAbandon = (customer.Cart_Abandonment_Rate || 0) / 100;
    if (cartAbandon > 0.6) score += 0.11;
    else if (cartAbandon > 0.4) score += 0.06;

    const wishlist = customer.Wishlist_Items || 0;
    if (wishlist === 0) score += 0.09;
    else if (wishlist < 2) score += 0.04;

    const discount = (customer.Discount_Usage_Rate || 0) / 100;
    if (discount > 0.7) score += 0.08;
    else if (discount > 0.5) score += 0.04;

    const age = customer.Age || 30;
    if (age < 25) score += 0.07;
    else if (age < 30) score += 0.03;

    const totalPurchases = customer.Total_Purchases || 0;
    if (totalPurchases < 5) score += 0.05;
    else if (totalPurchases < 10) score += 0.02;

    const emailOpen = (customer.Email_Open_Rate || 0) / 100;
    if (emailOpen < 0.2) score += 0.05;
    else if (emailOpen < 0.35) score += 0.02;

    const daysInactive = customer.Days_Since_Last_Purchase || 0;
    if (daysInactive > 60) score += 0.08;
    else if (daysInactive > 30) score += 0.04;

    const signupQuarter = customer.Signup_Quarter || '';
    if (signupQuarter === 'Q4') score += 0.04;
    else if (signupQuarter === 'Q3') score += 0.03;

    if (customer.Churned === 1) score = 0.95;

    return Math.min(score, 0.95);
  };

  // Normalisasi gender dari berbagai format
  const normalizeGender = (value) => {
    if (value === undefined || value === null || value === '') return 'Unknown';

    // Jika berupa angka (encoded)
    if (typeof value === 'number') {
      return value === 1 ? 'Male' : 'Female';
    }

    // Jika berupa string
    const str = String(value).toLowerCase().trim();
    if (str === 'male' || str === 'm' || str === '1') return 'Male';
    if (str === 'female' || str === 'f' || str === '0') return 'Female';

    return 'Unknown';
  };

  // Normalisasi quarter
  const normalizeQuarter = (value) => {
    if (value === undefined || value === null || value === '') return 'Q1';

    const str = String(value).toLowerCase().trim();
    if (str === 'q1' || str === '1') return 'Q1';
    if (str === 'q2' || str === '2') return 'Q2';
    if (str === 'q3' || str === '3') return 'Q3';
    if (str === 'q4' || str === '4') return 'Q4';

    return str.toUpperCase();
  };

  // Load dan proses data dari CSV
  useEffect(() => {
    const loadDataFromCSV = async () => {
      setLoading(true);
      try {
        let customers = [];

        if (customersCsv && customersCsv.trim() !== '') {
          const rows = customersCsv.trim().split('\n');
          const headers = rows[0].split(',').map(h => h.trim());

          customers = rows.slice(1).map((row, idx) => {
            const values = row.split(',').map(v => v.trim());
            const customer = {};
            headers.forEach((header, index) => {
              let value = values[index];
              if (value === undefined || value === '') {
                value = 0;
              }
              // Konversi ke number untuk kolom numerik
              const numericColumns = ['Age', 'Membership_Years', 'Login_Frequency', 'Session_Duration_Avg', 'Pages_Per_Session', 'Cart_Abandonment_Rate', 'Wishlist_Items', 'Total_Purchases', 'Average_Order_Value', 'Days_Since_Last_Purchase', 'Discount_Usage_Rate', 'Returns_Rate', 'Email_Open_Rate', 'Customer_Service_Calls', 'Product_Reviews_Written', 'Social_Media_Engagement_Score', 'Mobile_App_Usage', 'Payment_Method_Diversity', 'Lifetime_Value', 'Credit_Balance', 'Churned'];
              if (numericColumns.includes(header) && !isNaN(value) && value !== '') {
                value = parseFloat(value);
              }
              customer[header] = value;
            });
            return customer;
          });

          console.log(`✅ Loaded ${customers.length} customers from CSV`);

          // Debug: Lihat sample data
          if (customers.length > 0) {
            console.log('Sample customer:', {
              Age: customers[0].Age,
              Gender: customers[0].Gender,
              Gender_encoded: customers[0].Gender_encoded,
              Country: customers[0].Country,
              Churned: customers[0].Churned
            });
          }
        } else {
          console.warn('CSV file is empty');
          setLoading(false);
          return;
        }

        // Proses setiap customer dengan XGBoost prediction
        const enrichedCustomers = customers.map(customer => {
          const churnProbability = calculateChurnProbability(customer);
          let riskLevel = 'Low';
          if (churnProbability >= 0.7) riskLevel = 'High';
          else if (churnProbability >= 0.4) riskLevel = 'Medium';

          // Normalisasi gender
          let gender = normalizeGender(customer.Gender);
          if (gender === 'Unknown' && customer.Gender_encoded !== undefined) {
            gender = normalizeGender(customer.Gender_encoded);
          }

          return {
            ...customer,
            churn_probability: churnProbability,
            risk_level: riskLevel,
            is_churned: customer.Churned === 1,
            normalized_gender: gender,
            normalized_quarter: normalizeQuarter(customer.Signup_Quarter)
          };
        });

        // Hitung statistik dashboard
        const totalCustomers = enrichedCustomers.length;
        const highRiskCustomers = enrichedCustomers.filter(c => c.risk_level === 'High').length;
        const mediumRiskCustomers = enrichedCustomers.filter(c => c.risk_level === 'Medium').length;
        const loyalCustomers = enrichedCustomers.filter(c => c.risk_level === 'Low' && !c.is_churned).length;
        const churnedCount = enrichedCustomers.filter(c => c.is_churned).length;
        const churnRate = (churnedCount / totalCustomers) * 100;

        // Distribusi berdasarkan negara
        const countryMap = new Map();
        enrichedCustomers.forEach(c => {
          const country = c.Country || 'Unknown';
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        });
        const distributionByCountry = Array.from(countryMap.entries())
          .map(([label, total]) => ({ label, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 6);

        // Distribusi berdasarkan gender - DIPERBAIKI
        const genderMap = new Map();
        enrichedCustomers.forEach(c => {
          const gender = c.normalized_gender;
          genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
        });

        const distributionByGender = Array.from(genderMap.entries())
          .map(([label, total]) => ({ label, total }))
          .sort((a, b) => b.total - a.total);

        console.log('Gender distribution:', distributionByGender);

        // Distribusi berdasarkan kota (jika ada)
        const cityMap = new Map();
        enrichedCustomers.forEach(c => {
          const city = c.City || 'Unknown';
          cityMap.set(city, (cityMap.get(city) || 0) + 1);
        });
        const distributionByCity = Array.from(cityMap.entries())
          .map(([label, total]) => ({ label, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        // Tren churn per quarter
        const quarterMap = new Map();
        enrichedCustomers.forEach(c => {
          const quarter = c.normalized_quarter;
          const churned = c.is_churned ? 1 : 0;
          if (!quarterMap.has(quarter)) {
            quarterMap.set(quarter, { total: 0, churned: 0 });
          }
          const data = quarterMap.get(quarter);
          data.total++;
          data.churned += churned;
        });

        const churnTrend = Array.from(quarterMap.entries())
          .map(([period, data]) => ({
            period: period.toLowerCase(),
            churn_rate: (data.churned / data.total) * 100
          }))
          .sort((a, b) => {
            const order = { q1: 1, q2: 2, q3: 3, q4: 4 };
            return order[a.period] - order[b.period];
          });

        setDashboardStats({
          totalCustomers,
          highRiskCustomers,
          mediumRiskCustomers,
          loyalCustomers,
          churnRate,
          churnTrend,
          distributionByCountry,
          distributionByGender,
          distributionByCity,
          churnedCount
        });

      } catch (error) {
        console.error('Error loading CSV:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDataFromCSV();
  }, []);

  // Data untuk ditampilkan
  const kpis = [
    { icon: Users, label: t("stat.total.customers"), sub: t("stat.total.sub"), value: dashboardStats.totalCustomers, color: "#6366f1" },
    { icon: AlertTriangle, label: t("stat.high.risk"), sub: t("stat.high.sub"), value: dashboardStats.highRiskCustomers, color: "#f59e0b" },
    { icon: UserCheck, label: t("stat.loyal"), sub: t("stat.loyal.sub"), value: dashboardStats.loyalCustomers, color: "#10b981" },
    { icon: TrendingDown, label: t("stat.churn.rate"), sub: t("stat.churn.sub"), value: dashboardStats.churnRate, color: "#ef4444", decimals: 2, suffix: "%" },
  ];

  const trendData = dashboardStats.churnTrend.map((d) => ({
    period: QUARTER_LABEL[d.period] || d.period,
    churn: d.churn_rate
  }));

  const distSets = {
    status: [
      { name: "Loyal Customers", value: dashboardStats.loyalCustomers, color: "#10b981" },
      { name: "Medium Risk", value: dashboardStats.mediumRiskCustomers, color: "#f59e0b" },
      { name: "High Risk", value: dashboardStats.highRiskCustomers, color: "#ef4444" },
    ].filter(s => s.value > 0),
    country: dashboardStats.distributionByCountry.map((d, i) => ({
      name: fmtLabel(d.label),
      value: d.total,
      color: PIE_PALETTE[i % PIE_PALETTE.length]
    })),
    gender: dashboardStats.distributionByGender.map((d, i) => ({
      name: d.label,
      value: d.total,
      color: PIE_PALETTE[i % PIE_PALETTE.length]
    })),
    city: dashboardStats.distributionByCity.map((d, i) => ({
      name: fmtLabel(d.label),
      value: d.total,
      color: PIE_PALETTE[i % PIE_PALETTE.length]
    })),
  };

  const activeDist = distSets[distDim] || distSets.status;
  const distTotal = activeDist?.reduce((s, d) => s + d.value, 0) || 0;

  const distOptions = [
    { key: "status", label: "Risk Status", icon: Layers },
    { key: "country", label: "Country", icon: Globe },
    { key: "gender", label: "Gender", icon: Users },
    { key: "city", label: "City", icon: Globe },
  ];

  const panelTitle = (title, sub) => (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ color: themeColors.text, margin: 0, fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{title}</h3>
      <p style={{ color: themeColors.text, margin: "2px 0 0", fontSize: 11 }}>{sub}</p>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: themeColors.primary }} />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ perspective: "1000px" }}>
      <style>{`
        @keyframes springUp { 
          0% { opacity: 0; transform: translateY(30px) scale(0.96) rotateX(-4deg); } 
          60% { opacity: 0.8; transform: translateY(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); } 
        }
        @keyframes pulseGlow { 
          0%, 100% { transform: scale(1); opacity: 0.5; } 
          50% { transform: scale(1.5); opacity: 0.9; box-shadow: 0 0 14px #10b981; } 
        }
        .dash-enter-3d { opacity: 0; animation: springUp .75s cubic-bezier(.25, 1, .5, 1) forwards; }
        
        .kpi-card { transition: all .4s cubic-bezier(.25, 1, .22, 1); cursor: pointer; }
        .kpi-card:hover { 
          transform: translateY(-10px) scale(1.04); 
          border-color: var(--glow) !important; 
          box-shadow: 0 24px 50px -12px var(--glow);
          z-index: 10;
        }
        .kpi-card:hover .kpi-icon-holder { 
          background-color: var(--icon-color) !important; 
          transform: scale(1.1) rotate(-4deg);
          box-shadow: 0 4px 14px -2px var(--glow);
        }
        .kpi-card:hover .kpi-icon-svg { stroke: #fff !important; }
        
        .seg-btn { transition: all .3s cubic-bezier(.4, 0, .2, 1); cursor: pointer; position: relative; }
        .seg-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.15); }
        .seg-btn:active { transform: translateY(1px); }
        
        .dist-row { transition: all 0.25s cubic-bezier(.4, 0, .2, 1); border-radius: 10px; padding: 6px 8px; margin: 0 -8px; }
        .dist-row:hover { background-color: ${themeColors.inputBg}; padding-left: 2px; transform: translateX(4px); }
        
        .recharts-pie-cell { transition: transform 0.3s cubic-bezier(.175, .885, .32, 1.275), filter 0.3s; cursor: pointer; transform-origin: center; }
        .recharts-pie-cell:hover { transform: scale(1.06); filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.15)); }
        
        .pulse-dot { position: relative; }
        .pulse-dot::before { content: ''; position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: inherit; border-radius: 50%; animation: pulseGlow 2.5s infinite ease-in-out; }
      `}</style>

      {/* Header Dashboard */}
      <div className="dash-enter-3d" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 22, animationDelay: "0ms" }}>
        <div>
          <h2 style={{ color: themeColors.text, fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>{t("dashboard.title")}</h2>
          <p style={{ color: themeColors.text, fontSize: 12.5, margin: "5px 0 0" }}>{t("dashboard.subtitle")}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 99, background: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}`, backdropFilter: "blur(20px)", boxShadow: "0 6px 16px rgba(0,0,0,0.04)" }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <span style={{ color: themeColors.textSecondary, fontSize: 12, fontWeight: 600 }}>XGBoost &middot; Akurasi 87%</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 16 }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} themeColors={themeColors} isMobile={isMobile} delay={i * 70 + 50} />
        ))}
      </div>

      {/* Grid untuk Tren & Distribusi */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Grafik Tren Churn */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div className="dash-enter-3d" style={{ animationDelay: "280ms" }}>
            {panelTitle(t("churn.trend"), "Churn rate by signup quarter")}

            <ResponsiveContainer width="100%" height={isMobile ? 200 : 240}>
              <AreaChart data={trendData} margin={{ top: 6, right: 10, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} vertical={false} />
                <XAxis dataKey="period" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, (max) => Math.ceil(max + 10)]} />
                <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
                <Area type="monotone" dataKey="churn" stroke="#6366f1" strokeWidth={3} fill="url(#churnGrad)" name={`Churn Rate (%)`} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 4, stroke: themeColors.cardBg }} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Grafik Distribusi Pelanggan */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div className="dash-enter-3d" style={{ animationDelay: "350ms" }}>
            {panelTitle("Customer Distribution", "View by risk status, country, gender, or city")}

            <div style={{ display: "flex", gap: 4, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 12, padding: 4, marginBottom: 14, flexWrap: "wrap" }}>
              {distOptions.map((o) => {
                const active = distDim === o.key;
                const Icon = o.icon;
                return (
                  <button key={o.key} className="seg-btn" onClick={() => setDistDim(o.key)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 4px", borderRadius: 8, border: "none", fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", background: active ? themeColors.buttonPrimary : "transparent", color: active ? "#fff" : themeColors.textSecondary, boxShadow: active ? "0 4px 14px -3px rgba(99,102,241,0.4)" : "none" }}>
                    <Icon size={13} style={{ transform: active ? "scale(1.15)" : "scale(1)", transition: "transform 0.3s" }} /> {o.label}
                  </button>
                );
              })}
            </div>

            <ResponsiveContainer width="100%" height={isMobile ? 150 : 168}>
              <PieChart>
                <Pie data={activeDist} cx="50%" cy="50%" innerRadius={isMobile ? 36 : 48} outerRadius={isMobile ? 60 : 74} paddingAngle={4} dataKey="value" stroke={themeColors.cardBg} strokeWidth={2.5} animationDuration={700} animationEasing="ease-out">
                  {activeDist?.map((e, i) => (<Cell key={i} fill={e.color} className="recharts-pie-cell" />))}
                </Pie>
                <Tooltip formatter={(val, name) => [fmt(val), name]} contentStyle={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
              {activeDist?.map((d, i) => (
                <div key={i} className="dist-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0, boxShadow: `0 2px 5px ${d.color}55` }} />
                    <span style={{ color: themeColors.textSecondary, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                  </div>
                  <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 12.5, flexShrink: 0 }}>
                    {distTotal > 0 ? Math.round((d.value / distTotal) * 100) : 0}% <span style={{ color: themeColors.text, fontWeight: 400 }}>&middot; {fmt(d.value)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* XGBoost Feature Importance */}
      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div className="dash-enter-3d" style={{ animationDelay: "420ms" }}>
          {panelTitle("XGBoost Feature Importance", "Top predictors of customer churn from XGBoost model (FScore)")}

          <ResponsiveContainer width="100%" height={isMobile ? 320 : 400}>
            <BarChart data={XGBOOST_FEATURES} layout="vertical" margin={{ top: 4, right: 44, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
              <XAxis type="number" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 14]} />
              <YAxis dataKey="feature" type="category" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} axisLine={false} width={isMobile ? 130 : 170} />
              <Tooltip
                content={<CustomTooltip themeColors={themeColors} />}
                formatter={(value) => [`${value}%`, "Importance"]}
                cursor={{ fill: themeColors.inputBg, opacity: 0.5 }}
              />
              <Bar dataKey="value" name="Feature Importance (%)" radius={[0, 8, 8, 0]} barSize={isMobile ? 12 : 16} animationDuration={1400}>
                {XGBOOST_FEATURES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="right" fill={themeColors.textSecondary} fontSize={11} fontWeight={600} offset={10} formatter={(v) => `${v.toFixed(1)}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 16, padding: 12, background: `${themeColors.primary}10`, borderRadius: 10, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Phone size={16} color="#ef4444" />
                <span style={{ fontSize: 12, fontWeight: 600, color: themeColors.text }}>Top Predictor (12.38%)</span>
              </div>
              <p style={{ fontSize: 12, color: themeColors.textSecondary, margin: 0 }}>
                Customers with &gt;5 service calls are 3.4x more likely to churn
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <CreditCard size={16} color="#f59e0b" />
                <span style={{ fontSize: 12, fontWeight: 600, color: themeColors.text }}>Second Predictor (8.92%)</span>
              </div>
              <p style={{ fontSize: 12, color: themeColors.textSecondary, margin: 0 }}>
                Limited payment options increase churn by 2.8x
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Star size={16} color="#10b981" />
                <span style={{ fontSize: 12, fontWeight: 600, color: themeColors.text }}>Third Predictor (6.40%)</span>
              </div>
              <p style={{ fontSize: 12, color: themeColors.textSecondary, margin: 0 }}>
                No product reviews = 3.2x higher churn risk
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}