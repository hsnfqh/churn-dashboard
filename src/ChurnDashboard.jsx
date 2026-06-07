import { useState, useEffect } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import SettingsPanel from "./components/SettingsPanel";
import DashboardPage from "./components/DashboardPage";
import PredictionPage from "./components/PredictionPage";
import CustomerPage from "./components/CustomerPage";
import AnalyticsPage from "./components/AnalyticsPage";
import { mockCustomers } from "./data/mockData";

export default function ChurnDashboard() {
  const { themeColors } = useTheme();
  const { language } = useLanguage();
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
  const [pageTransition, setPageTransition] = useState(false);

  useEffect(() => {
    setPageTransition(false);
    const timer = setTimeout(() => setPageTransition(true), 50);
    return () => clearTimeout(timer);
  }, [activeSidebar]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
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
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: themeColors.background, 
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", 
      transition: "background 0.3s ease" 
    }}>
      {/* Overlay untuk mobile */}
      <div 
        onClick={() => setSidebarOpen(false)} 
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.5)", 
          zIndex: 45,
          backdropFilter: "blur(4px)",
          opacity: sidebarOpen && isMobile ? 1 : 0,
          visibility: sidebarOpen && isMobile ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          pointerEvents: sidebarOpen && isMobile ? "auto" : "none",
        }} 
      />
      
      <Sidebar 
        open={sidebarOpen} 
        active={activeSidebar} 
        onNavigate={(id) => { 
          setActiveSidebar(id); 
          if (isMobile) setSidebarOpen(false); 
        }} 
        isMobile={isMobile} 
      />
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden", 
        width: "100%",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <TopBar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          isMobile={isMobile} 
          onSettingsClick={() => setShowSettings(!showSettings)} 
          themeColors={themeColors} 
        />
        
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} themeColors={themeColors} />
        )}
        
        <main style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: isMobile ? "16px" : "24px 28px",
          opacity: pageTransition ? 1 : 0,
          transform: pageTransition ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {activeSidebar === "dashboard" && <DashboardPage isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "prediction" && <PredictionPage formData={formData} setFormData={setFormData} onPredict={handlePredict} predicting={predicting} result={predictionResult} isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "customers" && <CustomerPage customers={pagedCustomers} search={searchQuery} setSearch={setSearchQuery} filterRisk={filterRisk} setFilterRisk={setFilterRisk} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} total={filteredCustomers.length} isMobile={isMobile} themeColors={themeColors} />}
          {activeSidebar === "analytics" && <AnalyticsPage isMobile={isMobile} themeColors={themeColors} />}
        </main>
      </div>
    </div>
  );
}