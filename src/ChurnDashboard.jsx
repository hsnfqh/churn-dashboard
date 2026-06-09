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
    Customer_Name: "",

    Age: "",

    Gender: "Male",

    Country: "",
    City: "",
    Signup_Quarter: "Q1",

    Membership_Years: "",
    Login_Frequency: "",
    Session_Duration_Avg: "",
    Pages_Per_Session: "",
    Mobile_App_Usage: "",

    Total_Purchases: "",
    Average_Order_Value: "",
    Wishlist_Items: "",
    Cart_Abandonment_Rate: "",
    Days_Since_Last_Purchase: "",

    Lifetime_Value: "",
    Credit_Balance: "",
    Discount_Usage_Rate: "",
    Returns_Rate: "",
    Email_Open_Rate: "",
    Customer_Service_Calls: "",
    Product_Reviews_Written: "",
    Social_Media_Engagement_Score: "",
    Payment_Method_Diversity: ""
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

  const handlePredict = async () => {
    try {
      setPredicting(true);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,

            Age: Number(formData.Age),
            Membership_Years: Number(formData.Membership_Years),
            Login_Frequency: Number(formData.Login_Frequency),
            Session_Duration_Avg: Number(formData.Session_Duration_Avg),
            Pages_Per_Session: Number(formData.Pages_Per_Session),
            Cart_Abandonment_Rate: Number(formData.Cart_Abandonment_Rate),
            Wishlist_Items: Number(formData.Wishlist_Items),
            Total_Purchases: Number(formData.Total_Purchases),
            Average_Order_Value: Number(formData.Average_Order_Value),
            Days_Since_Last_Purchase: Number(formData.Days_Since_Last_Purchase),
            Discount_Usage_Rate: Number(formData.Discount_Usage_Rate),
            Returns_Rate: Number(formData.Returns_Rate),
            Email_Open_Rate: Number(formData.Email_Open_Rate),
            Customer_Service_Calls: Number(formData.Customer_Service_Calls),
            Product_Reviews_Written: Number(formData.Product_Reviews_Written),
            Social_Media_Engagement_Score: Number(formData.Social_Media_Engagement_Score),
            Mobile_App_Usage: Number(formData.Mobile_App_Usage),
            Payment_Method_Diversity: Number(formData.Payment_Method_Diversity),
            Lifetime_Value: Number(formData.Lifetime_Value),
            Credit_Balance: Number(formData.Credit_Balance)
          })
        }
      );

    const data = await response.json();

    setPredictionResult({
      probability: data.probability,
      level: data.level,
      cause: data.cause,
      recommendation: data.recommendation
    });

    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    } finally {
      setPredicting(false);
    }
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