import { useState, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, TrendingDown, Users, Star, BarChart2, Settings,
  Bell, Search, ChevronDown, AlertTriangle, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Filter, Download, RefreshCw,
  Gift, Phone, Zap, Shield, Target, Menu, X, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, Lightbulb, Activity, PieChart as PieIcon,
  UserCheck, UserX, Cpu, LogOut, HelpCircle, Crown, Layers,
  Sun, Moon, Globe
} from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import { useTheme } from "./contexts/ThemeContext";

const CHART_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#1e40af"];

const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
  id: `CST-${1000 + i}`,
  name: ["Ahmad Rizki", "Siti Nurhaliza", "Budi Santoso", "Dewi Rahayu", "Eko Prasetyo",
    "Fitriani", "Gunawan", "Hendra Wijaya", "Irma Susanti", "Joko Widodo"][i % 10],
  age: 22 + (i % 40),
  tenure: 1 + (i % 60),
  riskLevel: i % 5 === 0 ? "Critical" : i % 3 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",
  probability: Math.round(20 + Math.random() * 75),
  factor: ["Low Satisfaction", "High Price", "Poor Service", "Low Usage", "Late Payment"][i % 5],
  recommendation: ["Give Discount", "Loyalty Program", "Call Support", "Improve UX", "Payment Plan"][i % 5],
  spending: Math.round(100 + Math.random() * 900),
  satisfaction: Math.round(1 + Math.random() * 4),
}));

const churnTrendData = [
  { month: "Jan", churn: 8.2, retention: 91.8, newCustomers: 120 },
  { month: "Feb", churn: 7.8, retention: 92.2, newCustomers: 135 },
  { month: "Mar", churn: 9.1, retention: 90.9, newCustomers: 98 },
  { month: "Apr", churn: 10.4, retention: 89.6, newCustomers: 112 },
  { month: "May", churn: 8.9, retention: 91.1, newCustomers: 145 },
  { month: "Jun", churn: 7.5, retention: 92.5, newCustomers: 160 },
  { month: "Jul", churn: 6.8, retention: 93.2, newCustomers: 178 },
  { month: "Aug", churn: 8.2, retention: 91.8, newCustomers: 152 },
  { month: "Sep", churn: 9.5, retention: 90.5, newCustomers: 130 },
  { month: "Oct", churn: 7.1, retention: 92.9, newCustomers: 168 },
  { month: "Nov", churn: 6.4, retention: 93.6, newCustomers: 190 },
  { month: "Dec", churn: 5.8, retention: 94.2, newCustomers: 205 },
];

const churnFactorData = [
  { factor: "Price", value: 34, color: "#2563eb" },
  { factor: "Service", value: 27, color: "#3b82f6" },
  { factor: "Usage Freq", value: 19, color: "#60a5fa" },
  { factor: "Satisfaction", value: 15, color: "#93c5fd" },
  { factor: "Other", value: 5, color: "#bfdbfe" },
];

const distributionData = [
  { name: "Loyal", value: 72, color: "#2563eb" },
  { name: "At Risk", value: 18, color: "#60a5fa" },
  { name: "Churned", value: 10, color: "#1d4ed8" },
];

const segmentData = [
  { segment: "Champions", customers: 2840, churnRate: 2.1, clv: 1200 },
  { segment: "Loyal", customers: 3120, churnRate: 5.4, clv: 890 },
  { segment: "At Risk", customers: 1580, churnRate: 34.2, clv: 450 },
  { segment: "Lost", customers: 720, churnRate: 78.9, clv: 120 },
];

const featureImportanceData = [
  { feature: "Satisfaction Score", importance: 0.28 },
  { feature: "Monthly Usage", importance: 0.22 },
  { feature: "Tenure", importance: 0.18 },
  { feature: "Complaint Count", importance: 0.14 },
  { feature: "Late Payments", importance: 0.10 },
  { feature: "Spending", importance: 0.08 },
];

export default function ChurnDashboard() {
  const { theme, setTheme, themeColors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "", age: "", gender: "Male", tenure: "",
    monthlyUsage: "", transactionFreq: "", avgSpending: "",
    satisfactionScore: "", complaints: "", serviceRating: "",
    paymentMethod: "Credit Card", latePayment: "No", subscriptionType: "Basic",
  });
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(false);
    setTimeout(() => setAnimateIn(true), 50);
  }, [activeSidebar]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rowsPerPage = 10;
  const filteredCustomers = mockCustomers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    const matchFilter = filterRisk === "All" || c.riskLevel === filterRisk;
    return matchSearch && matchFilter;
  });
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const pagedCustomers = filteredCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePredict = () => {
    setPredicting(true);
    setTimeout(() => {
      const score = formData.satisfactionScore;
      const complaints = parseInt(formData.complaints) || 0;
      const tenure = parseInt(formData.tenure) || 0;
      const late = formData.latePayment === "Yes";
      let prob = 30;
      if (score <= 2) prob += 30;
      else if (score <= 3) prob += 15;
      if (complaints > 3) prob += 20;
      if (tenure < 6) prob += 15;
      if (late) prob += 10;
      prob = Math.min(95, Math.max(10, prob + Math.round(Math.random() * 10 - 5)));
      const level = prob >= 70 ? (language === 'id' ? 'RISIKO TINGGI' : 'HIGH RISK') : prob >= 40 ? (language === 'id' ? 'RISIKO SEDANG' : 'MEDIUM RISK') : (language === 'id' ? 'RISIKO RENDAH' : 'LOW RISK');
      const cause = prob >= 70
        ? (language === 'id' ? "Kepuasan Pelanggan Rendah & Keluhan Sering" : "Low Customer Satisfaction & Frequent Complaints")
        : prob >= 40 ? (language === 'id' ? "Penggunaan Sedang & Masalah Harga" : "Moderate Usage & Pricing Concerns")
        : (language === 'id' ? "Keterlibatan & Perilaku Loyal yang Kuat" : "Strong Engagement & Loyal Behavior");
      setPredictionResult({ probability: prob, level, cause });
      setPredicting(false);
    }, 2000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: themeColors.background, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s ease" }}>
      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, backdropFilter: "blur(4px)" }} />
      )}
      
      <Sidebar open={sidebarOpen} active={activeSidebar} onNavigate={(id) => { setActiveSidebar(id); if (isMobile) setSidebarOpen(false); }} isMobile={isMobile} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} onSettingsClick={() => setShowSettings(!showSettings)} themeColors={themeColors} />
        
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} themeColors={themeColors} />
        )}
        
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px", opacity: animateIn ? 1 : 0, transform: animateIn ? "translateY(0)" : "translateY(16px)", transition: "all 0.35s ease" }}>
          {activeSidebar === "dashboard" && <DashboardPage isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "prediction" && <PredictionPage formData={formData} setFormData={setFormData} onPredict={handlePredict} predicting={predicting} result={predictionResult} isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "customers" && <CustomerPage customers={pagedCustomers} search={searchQuery} setSearch={setSearchQuery} filterRisk={filterRisk} setFilterRisk={setFilterRisk} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} total={filteredCustomers.length} isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "analytics" && <AnalyticsPage isMobile={isMobile} themeColors={themeColors} />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ open, active, onNavigate, isMobile }) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, themeColors } = useTheme();
  
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t('nav.dashboard') },
    { id: "prediction", icon: Cpu, label: t('nav.prediction') },
    { id: "customers", icon: Users, label: t('nav.customers') },
    { id: "analytics", icon: BarChart2, label: t('nav.analytics') },
  ];

  return (
    <div style={{
      position: isMobile ? "fixed" : "relative",
      left: 0, top: 0, bottom: 0,
      width: open ? 260 : 0, minWidth: open ? 260 : 0,
      background: themeColors.sidebarBg,
      backdropFilter: "blur(20px)",
      borderRight: `1px solid ${themeColors.sidebarBorder}`,
      display: "flex", flexDirection: "column",
      transition: "all 0.3s ease", overflow: "hidden", zIndex: 50, flexShrink: 0, height: "100vh",
    }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${themeColors.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Cpu size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>{t('app.name')}</div>
            <div style={{ color: themeColors.textMuted, fontSize: 11, whiteSpace: "nowrap" }}>{t('app.subtitle')}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
            background: active === item.id ? "linear-gradient(135deg, rgba(37,99,235,0.4), rgba(59,130,246,0.2))" : "transparent",
            color: active === item.id ? "#93c5fd" : themeColors.textSecondary,
            borderLeft: active === item.id ? "2px solid #3b82f6" : "2px solid transparent",
            transition: "all 0.2s ease", width: "100%",
          }}>
            <item.icon size={18} />
            <span style={{ fontSize: 14, fontWeight: active === item.id ? 600 : 400 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: "12px", borderTop: `1px solid ${themeColors.sidebarBorder}` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${themeColors.inputBorder}`, background: themeColors.inputBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: themeColors.text,
          }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span style={{ fontSize: 12 }}>{theme === 'dark' ? t('light') : t('dark')}</span>
          </button>
          <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${themeColors.inputBorder}`, background: themeColors.inputBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: themeColors.text,
          }}>
            <Globe size={16} />
            <span style={{ fontSize: 12 }}>{language === 'id' ? 'EN' : 'ID'}</span>
          </button>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: themeColors.badgeBg, borderRadius: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: themeColors.text, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{t('admin')}</div>
            <div style={{ color: themeColors.textMuted, fontSize: 11, whiteSpace: "nowrap" }}>admin@churnai.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onMenuToggle, isMobile, onSettingsClick, themeColors }) {
  const { t } = useLanguage();
  return (
    <div style={{ height: 64, background: themeColors.cardBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${themeColors.cardBorder}`, display: "flex", alignItems: "center", padding: isMobile ? "0 16px" : "0 24px", gap: 16, flexShrink: 0 }}>
      <button onClick={onMenuToggle} style={{ background: "none", border: "none", color: themeColors.textSecondary, cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}>
        <Menu size={20} />
      </button>
      <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 360, position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
        <input placeholder={t('search.placeholder.top')} style={{ width: "100%", padding: "8px 12px 8px 36px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={onSettingsClick} style={{ width: 36, height: 36, borderRadius: 10, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: themeColors.textSecondary }}>
          <Settings size={17} />
        </button>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: themeColors.textSecondary, position: "relative" }}>
          <Bell size={17} />
          <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "1.5px solid #0d1f3c" }} />
        </button>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, cursor: "pointer" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
            <span style={{ color: themeColors.text, fontSize: 13 }}>{t('admin')}</span>
            <ChevronDown size={14} color={themeColors.textMuted} />
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ onClose, themeColors }) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, sms: false, weekly: true, critical: true });
  const [threshold, setThreshold] = useState(70);
  const [model, setModel] = useState("Advanced ML v2.1");

  return (
    <div style={{ position: "fixed", top: 64, right: 20, width: 320, background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 16, padding: "20px", zIndex: 100, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: themeColors.text, fontSize: 16, fontWeight: 600 }}>{t('settings.title')}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: themeColors.textMuted, cursor: "pointer" }}><X size={18} /></button>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: themeColors.textSecondary, fontSize: 13, display: "block", marginBottom: 8 }}>{t('theme')}</label>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setTheme('light')} style={{ flex: 1, padding: "8px", borderRadius: 8, background: theme === 'light' ? "#2563eb" : themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, color: theme === 'light' ? "#fff" : themeColors.text, cursor: "pointer", fontSize: 13 }}>{t('light')}</button>
          <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: "8px", borderRadius: 8, background: theme === 'dark' ? "#2563eb" : themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, color: theme === 'dark' ? "#fff" : themeColors.text, cursor: "pointer", fontSize: 13 }}>{t('dark')}</button>
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: themeColors.textSecondary, fontSize: 13, display: "block", marginBottom: 8 }}>{t('language')}</label>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setLanguage('id')} style={{ flex: 1, padding: "8px", borderRadius: 8, background: language === 'id' ? "#2563eb" : themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, color: language === 'id' ? "#fff" : themeColors.text, cursor: "pointer", fontSize: 13 }}>Indonesia</button>
          <button onClick={() => setLanguage('en')} style={{ flex: 1, padding: "8px", borderRadius: 8, background: language === 'en' ? "#2563eb" : themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, color: language === 'en' ? "#fff" : themeColors.text, cursor: "pointer", fontSize: 13 }}>English</button>
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: themeColors.textSecondary, fontSize: 13, display: "block", marginBottom: 8 }}>{t('prediction.model')}</label>
        <select value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", padding: "8px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.text, fontSize: 13, outline: "none" }}>
          {["Advanced ML v2.1", "Neural Network v1.4", "Ensemble Model v3.0"].map(m => <option key={m} style={{ background: themeColors.cardBg }}>{m}</option>)}
        </select>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: themeColors.textSecondary, fontSize: 13, display: "block", marginBottom: 8 }}>{t('high.risk.threshold')}: {threshold}%</label>
        <input type="range" min="50" max="90" value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      
      <div style={{ borderTop: `1px solid ${themeColors.sidebarBorder}`, paddingTop: 12, marginBottom: 12 }}>
        <h4 style={{ color: themeColors.text, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{t('notifications')}</h4>
        {[["email", "Email Alerts"], ["sms", "SMS Alerts"], ["weekly", "Weekly Report"], ["critical", "Critical Alerts"]].map(([key, title]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ color: themeColors.textSecondary, fontSize: 12 }}>{title}</span>
            <div onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))} style={{ width: 40, height: 22, borderRadius: 11, background: notifications[key] ? "#2563eb" : themeColors.inputBorder, cursor: "pointer", position: "relative", transition: "background 0.3s ease" }}>
              <div style={{ position: "absolute", top: 3, left: notifications[key] ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.3s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, sub, color, trend, trendUp, isMobile, themeColors }) {
  return (
    <div style={{ background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `${color}18` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={isMobile ? 16 : 20} color={color} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: trendUp ? "#10b981" : "#ef4444", background: trendUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "4px 8px", borderRadius: 20 }}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: themeColors.text, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: themeColors.textSecondary }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: themeColors.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function GlassCard({ children, style = {}, isMobile, themeColors }) {
  return (
    <div style={{ background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub, isMobile, themeColors }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ color: themeColors.text, fontSize: isMobile ? 16 : 18, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>{children}</h2>
      {sub && <p style={{ color: themeColors.textMuted, fontSize: 12, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function CustomTooltip({ active, payload, label, themeColors }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
      <p style={{ color: themeColors.textSecondary, margin: "0 0 6px", fontWeight: 500 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#60a5fa", margin: "2px 0", fontWeight: 600 }}>{p.name}: {p.value}{typeof p.value === "number" && p.value < 100 && p.name?.includes("%") ? "%" : ""}</p>
      ))}
    </div>
  );
}

function DashboardPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  
  const distData = [
    { name: t('loyal'), value: 72, color: "#2563eb" },
    { name: t('at.risk'), value: 18, color: "#60a5fa" },
    { name: t('churned'), value: 10, color: "#1d4ed8" },
  ];
  
  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('dashboard.subtitle')}>{t('dashboard.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={Users} title={t('stat.total.customers')} value="12,847" sub={t('stat.total.sub')} color="#3b82f6" trend="+4.2%" trendUp />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={AlertTriangle} title={t('stat.high.risk')} value="1,428" sub={t('stat.high.sub')} color="#f59e0b" trend="+8.1%" trendUp={false} />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={UserCheck} title={t('stat.loyal')} value="9,251" sub={t('stat.loyal.sub')} color="#10b981" trend="+2.3%" trendUp />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={TrendingDown} title={t('stat.churn.rate')} value="8.4%" sub={t('stat.churn.sub')} color="#ef4444" trend="-1.2%" trendUp />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ color: themeColors.text, margin: 0, fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.trend')}</h3>
              <p style={{ color: themeColors.textMuted, margin: "2px 0 0", fontSize: 11 }}>{t('churn.trend.sub')}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["1M", "3M", "1Y"].map(t => (
                <button key={t} style={{ padding: "4px 10px", background: t === "1Y" ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${t === "1Y" ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 6, color: t === "1Y" ? "#93c5fd" : themeColors.textSecondary, fontSize: 12, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <AreaChart data={churnTrendData}>
              <defs>
                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
              <XAxis dataKey="month" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
              <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
              <Area type="monotone" dataKey="churn" stroke="#2563eb" fill="url(#churnGrad)" name={t('stat.churn.rate')} strokeWidth={2} />
              <Area type="monotone" dataKey="newCustomers" stroke="#60a5fa" fill="url(#retentionGrad)" name={t('stat.total.customers')} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('customer.distribution')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('customer.distribution.sub')}</p>
          <ResponsiveContainer width="100%" height={isMobile ? 140 : 180}>
            <PieChart>
              <Pie data={distData} cx="50%" cy="50%" innerRadius={isMobile ? 30 : 50} outerRadius={isMobile ? 50 : 75} paddingAngle={4} dataKey="value">
                {distData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {distData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{d.name}</span>
                </div>
                <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 13 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.factor')}</h3>
        <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('churn.factor.sub')}</p>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
          <BarChart data={churnFactorData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
            <XAxis type="number" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <YAxis dataKey="factor" type="category" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} width={isMobile ? 70 : 90} />
            <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
            <Bar dataKey="value" name="Impact %" radius={[0, 6, 6, 0]}>
              {churnFactorData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

function PredictionPage({ formData, setFormData, onPredict, predicting, result, isMobile, themeColors }) {
  const { t, language } = useLanguage();
  const inputStyle = { width: "100%", padding: "10px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none", boxSizing: "border-box" };
  const labelStyle = { color: themeColors.textSecondary, fontSize: 13, marginBottom: 6, display: "block" };
  const fieldGroup = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 };
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const riskColor = result?.level?.includes("HIGH") || result?.level?.includes("RISIKO TINGGI") ? "#ef4444" : result?.level?.includes("MEDIUM") || result?.level?.includes("RISIKO SEDANG") ? "#f59e0b" : "#10b981";
  const riskBg = result?.level?.includes("HIGH") || result?.level?.includes("RISIKO TINGGI") ? "rgba(239,68,68,0.1)" : result?.level?.includes("MEDIUM") || result?.level?.includes("RISIKO SEDANG") ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('prediction.subtitle')}>{t('prediction.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: result && !isMobile ? "1fr 1fr" : "1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Users size={16} /> {t('customer.info')}</h3>
            <div style={fieldGroup}>
              {[["customerId", t('customer.id'), "text", "CST-1001"], ["age", t('age'), "number", "28"]].map(([key, label, type, ph]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input type={type} value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={inputStyle} /></div>
              ))}
              <div><label style={labelStyle}>{t('gender')}</label><select value={formData.gender} onChange={e => set("gender", e.target.value)} style={inputStyle}>{["Male", "Female", "Other"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('tenure')}</label><input type="number" value={formData.tenure} onChange={e => set("tenure", e.target.value)} placeholder="24" style={inputStyle} /></div>
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Activity size={16} /> {t('usage.behavior')}</h3>
            <div style={fieldGroup}>
              {[["monthlyUsage", t('monthly.usage'), "number", "45"], ["transactionFreq", t('transaction.freq'), "number", "12"], ["avgSpending", t('avg.spending'), "number", "250"]].map(([key, label, type, ph]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input type={type} value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={inputStyle} /></div>
              ))}
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Star size={16} /> {t('customer.satisfaction')}</h3>
            <div style={fieldGroup}>
              <div><label style={labelStyle}>{t('satisfaction.score')}</label><select value={formData.satisfactionScore} onChange={e => set("satisfactionScore", e.target.value)} style={inputStyle}><option value="" style={{ background: themeColors.cardBg }}>Select score</option>{[1,2,3,4,5].map(v => <option key={v} value={v} style={{ background: themeColors.cardBg }}>{v} - {["Very Low","Low","Neutral","High","Very High"][v-1]}</option>)}</select></div>
              <div><label style={labelStyle}>{t('complaints')}</label><input type="number" value={formData.complaints} onChange={e => set("complaints", e.target.value)} placeholder="0" style={inputStyle} /></div>
              <div><label style={labelStyle}>{t('service.rating')}</label><input type="number" min="1" max="5" value={formData.serviceRating} onChange={e => set("serviceRating", e.target.value)} placeholder="4" style={inputStyle} /></div>
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Shield size={16} /> {t('payment.details')}</h3>
            <div style={fieldGroup}>
              <div><label style={labelStyle}>{t('payment.method')}</label><select value={formData.paymentMethod} onChange={e => set("paymentMethod", e.target.value)} style={inputStyle}>{["Credit Card","Debit Card","Bank Transfer","Digital Wallet"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('late.payment')}</label><select value={formData.latePayment} onChange={e => set("latePayment", e.target.value)} style={inputStyle}>{["No","Yes","Sometimes"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('subscription.type')}</label><select value={formData.subscriptionType} onChange={e => set("subscriptionType", e.target.value)} style={inputStyle}>{["Basic","Standard","Premium","Enterprise"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
            </div>
          </GlassCard>

          <button onClick={onPredict} disabled={predicting} style={{ padding: "14px 28px", background: predicting ? "rgba(37,99,235,0.5)" : "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, cursor: predicting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: predicting ? "none" : "0 6px 24px rgba(37,99,235,0.4)" }}>
            {predicting ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> {t('analyzing')}</> : <><Cpu size={18} /> {t('predict.button')}</>}
          </button>
        </div>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ border: `1px solid ${riskColor}33` }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 16 }}>{t('prediction.result')}</div>
                <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
                  <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 0 }}>
                    <circle cx="80" cy="80" r="68" fill="none" stroke={themeColors.inputBorder} strokeWidth="12" />
                    <circle cx="80" cy="80" r="68" fill="none" stroke={riskColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 68 * result.probability / 100} ${2 * Math.PI * 68}`} strokeDashoffset={2 * Math.PI * 68 * 0.25} style={{ transition: "stroke-dasharray 1.5s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: riskColor }}>{result.probability}%</div>
                    <div style={{ fontSize: 11, color: themeColors.textMuted }}>{t('probability')}</div>
                  </div>
                </div>
                <div style={{ display: "inline-block", padding: "8px 20px", background: riskBg, border: `1px solid ${riskColor}44`, borderRadius: 100, color: riskColor, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{result.level}</div>
                <p style={{ color: themeColors.textSecondary, fontSize: 13, margin: 0 }}>{t('main.cause')}: <span style={{ color: themeColors.text, fontWeight: 600 }}>{result.cause}</span></p>
              </div>
            </GlassCard>

            <GlassCard isMobile={isMobile} themeColors={themeColors}>
              <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>{t('recommended.actions')}</h3>
              {[
                result.probability >= 70 ? (language === 'id' ? "Segera tugaskan manajer sukses pelanggan khusus" : "Immediately assign a dedicated customer success manager") : (language === 'id' ? "Jadwalkan panggilan check-in rutin" : "Schedule a regular check-in call"),
                result.probability >= 50 ? (language === 'id' ? "Tawarkan diskon atau upgrade yang dipersonalisasi" : "Offer a personalized discount or upgrade") : (language === 'id' ? "Kirim survei kepuasan" : "Send a satisfaction survey"),
                language === 'id' ? "Daftarkan program loyalitas" : "Enroll in loyalty rewards program",
                result.probability >= 70 ? (language === 'id' ? "Kirim ke tim spesialis retensi" : "Escalate to retention specialist team") : (language === 'id' ? "Berikan sumber daya edukasi" : "Provide educational resources"),
              ].map((action, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${themeColors.sidebarBorder}` : "none" }}>
                  <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{action}</span>
                </div>
              ))}
            </GlassCard>

            <GlassCard isMobile={isMobile} themeColors={themeColors}>
              <h3 style={{ color: "#93c5fd", margin: "0 0 14px", fontSize: 14, fontWeight: 600 }}>{t('risk.breakdown')}</h3>
              {[
                [t('satisfaction'), result.probability >= 70 ? 85 : 40, "#ef4444"],
                [t('price.sensitivity'), 65, "#f59e0b"],
                [t('usage.pattern'), result.probability >= 50 ? 70 : 30, "#3b82f6"],
                [t('loyalty.index'), 100 - result.probability, "#10b981"]
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{label}</span>
                    <span style={{ color: themeColors.text, fontSize: 13, fontWeight: 600 }}>{val}%</span>
                  </div>
                  <div style={{ height: 6, background: themeColors.inputBorder, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 10, transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CustomerPage({ customers, search, setSearch, filterRisk, setFilterRisk, currentPage, setCurrentPage, totalPages, total, isMobile, themeColors }) {
  const { t } = useLanguage();
  const riskColors = { Critical: "#ef4444", High: "#f59e0b", Medium: "#3b82f6", Low: "#10b981" };
  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={`${total} ${t('customers.found')}`}>{t('customer.management')}</SectionTitle>
      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search.placeholder')} style={{ width: "100%", padding: "9px 12px 9px 34px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map(r => (
              <button key={r} onClick={() => setFilterRisk(r)} style={{ padding: "8px 14px", background: filterRisk === r ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${filterRisk === r ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: filterRisk === r ? "#93c5fd" : themeColors.textSecondary, fontSize: 13, cursor: "pointer" }}>{r}</button>
            ))}
          </div>
          <button style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('export')}</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 11 : 13 }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.4), rgba(37,99,235,0.2))" }}>
                {[t('customer.id.table'), t('name'), t('age'), t('tenure'), t('risk.level'), t('probability.table'), t('main.factor'), t('recommendation')].map(h => (
                  <th key={h} style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#93c5fd", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}`, background: i % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd }}>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#60a5fa", fontFamily: "monospace", fontSize: isMobile ? 10 : 13 }}>{c.id}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.text, fontWeight: 500, fontSize: isMobile ? 11 : 13 }}>{c.name}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 11 : 13 }}>{c.age}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 11 : 13 }}>{c.tenure}m</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px" }}>
                    <span style={{ padding: "4px 10px", background: `${riskColors[c.riskLevel]}18`, border: `1px solid ${riskColors[c.riskLevel]}44`, borderRadius: 20, color: riskColors[c.riskLevel], fontSize: isMobile ? 9 : 11, fontWeight: 600 }}>{c.riskLevel}</span>
                  </td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: themeColors.inputBorder, borderRadius: 4, overflow: "hidden", minWidth: isMobile ? 40 : 60 }}>
                        <div style={{ height: "100%", width: `${c.probability}%`, background: c.probability >= 70 ? "#ef4444" : c.probability >= 40 ? "#f59e0b" : "#10b981", borderRadius: 4 }} />
                      </div>
                      <span style={{ color: themeColors.text, fontWeight: 600, minWidth: 36, fontSize: isMobile ? 10 : 13 }}>{c.probability}%</span>
                    </div>
                   </td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 10 : 13 }}>{c.factor}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#60a5fa", fontSize: isMobile ? 10 : 12 }}>{c.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <span style={{ color: themeColors.textMuted, fontSize: 13 }}>{t('showing')} {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, total)} {t('of')} {total}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 32, height: 32, background: currentPage === p ? "rgba(37,99,235,0.4)" : themeColors.inputBg, border: `1px solid ${currentPage === p ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: currentPage === p ? "#93c5fd" : themeColors.textSecondary, cursor: "pointer", fontSize: 13, fontWeight: currentPage === p ? 600 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function AnalyticsPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  const insights = [
    { icon: AlertTriangle, color: "#ef4444", text: "Customers with satisfaction score ≤2 have 3.4× higher churn probability." },
    { icon: TrendingDown, color: "#f59e0b", text: "Late payment customers churn at 42% vs 8% for on-time payers." },
    { icon: UserCheck, color: "#10b981", text: "Customers with tenure >24 months show 78% lower churn rate." },
    { icon: Zap, color: "#3b82f6", text: "High-frequency users (>30 sessions/month) are 5× more likely to remain loyal." },
  ];

  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('analytics.subtitle')}>{t('analytics.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('feature.importance')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('feature.sub')}</p>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
              <XAxis type="number" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} width={isMobile ? 90 : 110} />
              <Tooltip content={<CustomTooltip themeColors={themeColors} />} formatter={v => [`${(v * 100).toFixed(0)}%`]} />
              <Bar dataKey="importance" name="Importance" radius={[0, 6, 6, 0]}>
                {featureImportanceData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i] || "#2563eb"} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('customer.segments')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('segments.sub')}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {segmentData.map((s, i) => (
              <div key={i} style={{ background: themeColors.badgeBg, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${CHART_COLORS[i]}22`, border: `1px solid ${CHART_COLORS[i]}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Layers size={18} color={CHART_COLORS[i]} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 14 }}>{s.segment}</span>
                    <span style={{ color: s.churnRate > 30 ? "#ef4444" : s.churnRate > 10 ? "#f59e0b" : "#10b981", fontSize: 13, fontWeight: 700 }}>{s.churnRate}% churn</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ color: themeColors.textMuted, fontSize: 12 }}>{s.customers.toLocaleString()} {t('customers.count')}</span>
                    <span style={{ color: themeColors.textMuted, fontSize: 12 }}>CLV: ${s.clv}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ marginBottom: 16 }}>
        <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('risk.distribution')}</h3>
        <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('risk.distribution.sub')}</p>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
          <BarChart data={churnTrendData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
            <XAxis dataKey="month" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
            <Bar dataKey="churn" name="High Risk %" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="newCustomers" name="New Customers" stackId="b" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ background: `${ins.color}0d`, border: `1px solid ${ins.color}33`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <ins.icon size={18} color={ins.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: themeColors.textSecondary, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}