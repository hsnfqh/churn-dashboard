import { useState, useEffect } from "react";
import { Users, AlertTriangle, UserCheck, TrendingDown, Globe, Layers } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LabelList } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import CustomTooltip from "./CustomTooltip";
import dashboardData from "../data/dashboard_data.json";

const fmt = (n) => Math.round(n).toLocaleString("id-ID");
const fmtLabel = (s) => (s.length <= 3 ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1));
const PIE_PALETTE = ["#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#ef4444"];

const QUARTER_LABEL = { q1: "Jan–Mar", q2: "Apr–Jun", q3: "Jul–Sep", q4: "Okt–Des" };

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
      <div style={{ fontSize: 12, color: themeColors.textMuted, position: "relative", zIndex: 1 }}>{sub}</div>
    </div>
  );
}

// ==========================================
// UTAMA: HALAMAN DASHBOARD PAGE
// ==========================================
export default function DashboardPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  const { summary, churn_trend, distribution_by_country, distribution_by_gender, top_churn_factors } = dashboardData;
  const [distDim, setDistDim] = useState("status");

  // Inisialisasi Data untuk UI 4 Macam KPI Cards
  const kpis = [
    { icon: Users, label: t("stat.total.customers"), sub: t("stat.total.sub"), value: summary.total_customers, color: "#6366f1" },
    { icon: AlertTriangle, label: t("stat.high.risk"), sub: t("stat.high.sub"), value: summary.high_risk_customers, color: "#f59e0b" },
    { icon: UserCheck, label: t("stat.loyal"), sub: t("stat.loyal.sub"), value: summary.loyal_customers, color: "#10b981" },
    { icon: TrendingDown, label: t("stat.churn.rate"), sub: t("stat.churn.sub"), value: summary.churn_rate_pct, color: "#ef4444", decimals: 2, suffix: "%" },
  ];

  const trendData = churn_trend.map((d) => ({ period: QUARTER_LABEL[d.period] || d.period, churn: d.churn_rate }));

  const distSets = {
    status: [
      { name: t("loyal"), value: summary.loyal_customers, color: "#10b981" },
      { name: t("high.risk"), value: summary.high_risk_customers, color: "#f59e0b" },
    ],
    country: distribution_by_country.map((d, i) => ({ name: fmtLabel(d.label), value: d.total, color: PIE_PALETTE[i % PIE_PALETTE.length] })),
    gender: distribution_by_gender.map((d, i) => ({ name: fmtLabel(d.label), value: d.total, color: PIE_PALETTE[i % PIE_PALETTE.length] })),
  };
  const activeDist = distSets[distDim];
  const distTotal = activeDist.reduce((s, d) => s + d.value, 0);

  const distOptions = [
    { key: "status", label: t("status"), icon: Layers },
    { key: "country", label: t("country"), icon: Globe },
    { key: "gender", label: t("gender"), icon: Users },
  ];

  const factorData = top_churn_factors.map((d) => ({ factor: d.feature.replace(/_/g, " "), value: +(d.importance * 100).toFixed(1) }));

  const panelTitle = (title, sub) => (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ color: themeColors.text, margin: 0, fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{title}</h3>
      <p style={{ color: themeColors.textMuted, margin: "2px 0 0", fontSize: 11 }}>{sub}</p>
    </div>
  );

  return (
    <div style={{ perspective: "1000px" }}>
      {/* ==========================================
          STYLING & ANIMASI CSS (Global Interactivity)
          ========================================== */}
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
        
        /* KPI Cards Interactivity */
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
        
        /* Buttons Interactivity */
        .seg-btn { transition: all .3s cubic-bezier(.4, 0, .2, 1); cursor: pointer; position: relative; }
        .seg-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.15); }
        .seg-btn:active { transform: translateY(1px); }
        
        /* List Distribution Rows Interactivity */
        .dist-row { transition: all 0.25s cubic-bezier(.4, 0, .2, 1); border-radius: 10px; padding: 6px 8px; margin: 0 -8px; }
        .dist-row:hover { background-color: ${themeColors.inputBg}; padding-left: 2px; transform: translateX(4px); }
        
        /* Recharts SVG Interactivity */
        .recharts-pie-cell { transition: transform 0.3s cubic-bezier(.175, .885, .32, 1.275), filter 0.3s; cursor: pointer; transform-origin: center; }
        .recharts-pie-cell:hover { transform: scale(1.06); filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.15)); }
        .recharts-bar-rectangle { transition: all 0.3s ease; cursor: pointer; }
        .recharts-bar-rectangle:hover { filter: brightness(1.15) drop-shadow(0px 4px 10px rgba(245,158,11,0.4)); }
        
        .pulse-dot { position: relative; }
        .pulse-dot::before { content: ''; position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: inherit; border-radius: 50%; animation: pulseGlow 2.5s infinite ease-in-out; }
      `}</style>

      {/* ==========================================
          UI BLOK 1: HEADER DASHBOARD
          Menampilkan: Ringkasan Dashboard, Deskripsi, Badge Model & Akurasi (XGBoost 91%)
          ========================================== */}
      <div className="dash-enter-3d" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 22, animationDelay: "0ms" }}>
        <div>
          {/* Judul: "Ringkasan Dashboard" */}
          <h2 style={{ color: themeColors.text, fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>{t("dashboard.title")}</h2>
          {/* Subtitle: "Gambaran metrik churn dan tren pelanggan" */}
          <p style={{ color: themeColors.textMuted, fontSize: 12.5, margin: "5px 0 0" }}>{t("dashboard.subtitle")}</p>
        </div>
        {/* Badge Sisi Kanan: "XGBoost · Akurasi 91%" */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 99, background: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}`, backdropFilter: "blur(20px)", boxShadow: "0 6px 16px rgba(0,0,0,0.04)" }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <span style={{ color: themeColors.textSecondary, fontSize: 12, fontWeight: 600 }}>XGBoost &middot; Akurasi 91%</span>
        </div>
      </div>

      {/* ==========================================
          UI BLOK 2: Kumpulan KPI CARDS (Metrik Grid)
          Menampilkan: Total Pelanggan (35.714), Risiko Tinggi (8.793), Pelanggan Setia (26.921), Tingkat Churn (24.62%)
          ========================================== */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 16 }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} themeColors={themeColors} isMobile={isMobile} delay={i * 70 + 50} />
        ))}
      </div>

      {/* Grid untuk Tren & Distribusi */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        
        {/* ==========================================
            UI BLOK 3: GRAFIK TREN CHURN (Area Chart Recharts)
            Menampilkan: Judul "Tren Churn", Subtitle "Churn berdasarkan kuartal...", dan Grafik Linear (Jan-Mar, dll)
            ========================================== */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div className="dash-enter-3d" style={{ animationDelay: "280ms" }}>
            {/* Judul & Deskripsi Tren Churn */}
            {panelTitle(t("churn.trend"), t("churn.trend.sub"))}
            
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
                <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, (max) => Math.ceil(max + 6)]} />
                <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
                <Area type="monotone" dataKey="churn" stroke="#6366f1" strokeWidth={3} fill="url(#churnGrad)" name={`${t("stat.churn.rate")} (%)`} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 4, stroke: themeColors.cardBg }} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* ==========================================
            UI BLOK 4: GRAFIK DISTRIBUSI PELANGGAN (Donut / Pie Chart & List Keterangan)
            Menampilkan: Judul "Distribusi Pelanggan", Tombol Filter (Status, Country, Gender), Donut Chart, dan Persentase List (Setia 75%, Risiko Tinggi 25%)
            ========================================== */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div className="dash-enter-3d" style={{ animationDelay: "350ms" }}>
            {/* Judul & Deskripsi Distribusi */}
            {panelTitle(t("customer.distribution"), t("customer.distribution.sub"))}

            {/* Toggle/Segmented Button Pilihan Dimensi (Status, Negara, Gender) */}
            <div style={{ display: "flex", gap: 4, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 12, padding: 4, marginBottom: 14 }}>
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

            {/* Render Grafik Lingkaran (Donut Chart) */}
            <ResponsiveContainer width="100%" height={isMobile ? 150 : 168}>
              <PieChart>
                <Pie data={activeDist} cx="50%" cy="50%" innerRadius={isMobile ? 36 : 48} outerRadius={isMobile ? 60 : 74} paddingAngle={4} dataKey="value" stroke={themeColors.cardBg} strokeWidth={2.5} animationDuration={700} animationEasing="ease-out">
                  {activeDist.map((e, i) => (<Cell key={i} fill={e.color} className="recharts-pie-cell" />))}
                </Pie>
                <Tooltip formatter={(val, name) => [fmt(val), name]} contentStyle={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Baris List Keterangan di bawah Grafik Lingkaran (e.g., Setia 75% · 26.921) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
              {activeDist.map((d, i) => (
                <div key={i} className="dist-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0, boxShadow: `0 2px 5px ${d.color}55` }} />
                    <span style={{ color: themeColors.textSecondary, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                  </div>
                  <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 12.5, flexShrink: 0 }}>
                    {Math.round((d.value / distTotal) * 100)}% <span style={{ color: themeColors.textMuted, fontWeight: 400 }}>&middot; {fmt(d.value)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ==========================================
          UI BLOK 5: ANALISIS FAKTOR CHURN (Bar Chart Recharts)
          Menampilkan: Judul "Analisis Faktor Churn", Subtitle "Penyebab utama churn...", dan Grafik Batang Horizontal Feature Importance
          ========================================== */}
      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div className="dash-enter-3d" style={{ animationDelay: "420ms" }}>
          {/* Judul & Deskripsi Analisis Faktor Churn */}
          {panelTitle(t("churn.factor"), t("churn.factor.sub"))}
          
          <ResponsiveContainer width="100%" height={isMobile ? 230 : 280}>
            <BarChart data={factorData} layout="vertical" margin={{ top: 4, right: 44, left: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="barGradYellow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
              <XAxis type="number" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="factor" type="category" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} axisLine={false} width={isMobile ? 112 : 150} />
              <Tooltip content={<CustomTooltip themeColors={themeColors} />} cursor={{ fill: themeColors.inputBg, opacity: 0.5 }} />
              <Bar dataKey="value" name={t("feature.importance")} radius={[0, 6, 6, 0]} fill="url(#barGradYellow)" barSize={isMobile ? 14 : 18} animationDuration={1400}>
                <LabelList dataKey="value" position="right" fill={themeColors.textSecondary} fontSize={11} fontWeight={600} offset={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}


// import { Users, AlertTriangle, UserCheck, TrendingDown } from "lucide-react";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
// import { useLanguage } from "../contexts/LanguageContext";
// import StatCard from "./StatCard";
// import GlassCard from "./GlassCard";
// import SectionTitle from "./SectionTitle";
// import CustomTooltip from "./CustomTooltip";
// import { churnTrendData, churnFactorData, distributionData } from "../data/mockData";

// export default function DashboardPage({ isMobile, themeColors }) {
//   const { t } = useLanguage();
  
//   const distData = [
//     { name: t('loyal'), value: 72, color: "#2563eb" },
//     { name: t('at.risk'), value: 18, color: "#60a5fa" },
//     { name: t('churned'), value: 10, color: "#1d4ed8" },
//   ];
  
//   return (
//     <div>
//       <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('dashboard.subtitle')}>{t('dashboard.title')}</SectionTitle>
//       <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
//         <StatCard isMobile={isMobile} themeColors={themeColors} icon={Users} title={t('stat.total.customers')} value="12,847" sub={t('stat.total.sub')} color="#3b82f6" trend="+4.2%" trendUp />
//         <StatCard isMobile={isMobile} themeColors={themeColors} icon={AlertTriangle} title={t('stat.high.risk')} value="1,428" sub={t('stat.high.sub')} color="#f59e0b" trend="+8.1%" trendUp={false} />
//         <StatCard isMobile={isMobile} themeColors={themeColors} icon={UserCheck} title={t('stat.loyal')} value="9,251" sub={t('stat.loyal.sub')} color="#10b981" trend="+2.3%" trendUp />
//         <StatCard isMobile={isMobile} themeColors={themeColors} icon={TrendingDown} title={t('stat.churn.rate')} value="8.4%" sub={t('stat.churn.sub')} color="#ef4444" trend="-1.2%" trendUp />
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16, marginBottom: 16 }}>
//         <GlassCard isMobile={isMobile} themeColors={themeColors}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
//             <div>
//               <h3 style={{ color: themeColors.text, margin: 0, fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.trend')}</h3>
//               <p style={{ color: themeColors.textMuted, margin: "2px 0 0", fontSize: 11 }}>{t('churn.trend.sub')}</p>
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               {["1M", "3M", "1Y"].map(t => (
//                 <button key={t} style={{ padding: "4px 10px", background: t === "1Y" ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${t === "1Y" ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 6, color: t === "1Y" ? "#93c5fd" : themeColors.textSecondary, fontSize: 12, cursor: "pointer" }}>{t}</button>
//               ))}
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
//             <AreaChart data={churnTrendData}>
//               <defs>
//                 <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
//               <XAxis dataKey="month" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
//               <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
//               <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
//               <Area type="monotone" dataKey="churn" stroke="#2563eb" fill="url(#churnGrad)" name={t('stat.churn.rate')} strokeWidth={2} />
//               <Area type="monotone" dataKey="newCustomers" stroke="#60a5fa" fill="url(#churnGrad)" name={t('stat.total.customers')} strokeWidth={2} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </GlassCard>

//         <GlassCard isMobile={isMobile} themeColors={themeColors}>
//           <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('customer.distribution')}</h3>
//           <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('customer.distribution.sub')}</p>
//           <ResponsiveContainer width="100%" height={isMobile ? 140 : 180}>
//             <PieChart>
//               <Pie data={distData} cx="50%" cy="50%" innerRadius={isMobile ? 30 : 50} outerRadius={isMobile ? 50 : 75} paddingAngle={4} dataKey="value">
//                 {distData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
//               </Pie>
//               <Tooltip contentStyle={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10 }} />
//             </PieChart>
//           </ResponsiveContainer>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {distData.map((d, i) => (
//               <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
//                   <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{d.name}</span>
//                 </div>
//                 <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 13 }}>{d.value}%</span>
//               </div>
//             ))}
//           </div>
//         </GlassCard>
//       </div>

//       <GlassCard isMobile={isMobile} themeColors={themeColors}>
//         <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.factor')}</h3>
//         <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('churn.factor.sub')}</p>
//         <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
//           <BarChart data={churnFactorData} layout="vertical">
//             <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
//             <XAxis type="number" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
//             <YAxis dataKey="factor" type="category" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} width={isMobile ? 70 : 90} />
//             <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
//             <Bar dataKey="value" name="Impact %" radius={[0, 6, 6, 0]}>
//               {churnFactorData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </GlassCard>
//     </div>
//   );
// }