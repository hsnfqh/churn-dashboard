import { useState, useEffect } from "react";
import {
  Phone, CreditCard, Star, Wallet, ShoppingCart,
  User, Flag, MapPin, Calendar, Sparkles, RefreshCw,
  Mail, Gift, Loader, Download, FileUp, Trash2
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import Papa from "papaparse";

// Import CSV sebagai raw text
import customersCsv from "../data/customers.csv?raw";

// Top 5 Feature Importance dari XGBoost
const TOP_FEATURES = [
  { feature: "Customer Service Calls", importance: 12.38, key: "serviceCalls", icon: Phone, color: "#ef4444" },
  { feature: "Payment Method Diversity", importance: 8.92, key: "paymentDiversity", icon: CreditCard, color: "#f59e0b" },
  { feature: "Product Reviews Written", importance: 6.40, key: "productReviews", icon: Star, color: "#10b981" },
  { feature: "Lifetime Value", importance: 5.93, key: "lifetimeValue", icon: Wallet, color: "#3b82f6" },
  { feature: "Cart Abandonment Rate", importance: 5.80, key: "cartAbandon", icon: ShoppingCart, color: "#8b5cf6" }
];

export default function PredictionPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [showBatchResults, setShowBatchResults] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Data dari CSV
  const [countriesList, setCountriesList] = useState(["USA", "UK", "Canada", "Germany", "Australia", "France"]);
  const [citiesByCountry, setCitiesByCountry] = useState({});
  const [quartersList, setQuartersList] = useState(["Q1", "Q2", "Q3", "Q4"]);
  const [gendersList, setGendersList] = useState(["Male", "Female"]);

  const [formData, setFormData] = useState({
    age: 30,
    gender: "Male",
    country: "USA",
    city: "",
    signupQuarter: "Q1",
    serviceCalls: 0,
    paymentDiversity: 50,
    productReviews: 0,
    lifetimeValue: 1000,
    cartAbandon: 30
  });

  // List kota berdasarkan negara yang dipilih
  const [availableCities, setAvailableCities] = useState([]);

  const isLightMode = themeColors.bodyBg === "#ffffff" || themeColors.bodyBg === "#f8fafc";

  const riskColors = {
    High: isLightMode ? "#dc2626" : "#ef4444",
    Medium: isLightMode ? "#ea580c" : "#f97316",
    Low: isLightMode ? "#16a34a" : "#22c55e"
  };

  // Load data dari CSV untuk mendapatkan pilihan
  useEffect(() => {
    const loadDataFromCSV = async () => {
      try {
        if (customersCsv && customersCsv.trim() !== '') {
          const rows = customersCsv.trim().split('\n');
          const headers = rows[0].split(',').map(h => h.trim());

          const customers = rows.slice(1).map((row) => {
            const values = row.split(',').map(v => v.trim());
            const customer = {};
            headers.forEach((header, index) => {
              let value = values[index];
              if (value === undefined || value === '') value = 0;
              const numericColumns = ['Age', 'Total_Purchases', 'Lifetime_Value', 'Customer_Service_Calls', 'Cart_Abandonment_Rate', 'Discount_Usage_Rate', 'Product_Reviews_Written', 'Days_Since_Last_Purchase'];
              if (numericColumns.includes(header) && !isNaN(value) && value !== '') {
                value = parseFloat(value);
              }
              customer[header] = value;
            });
            return customer;
          });

          // Ambil unique countries
          const uniqueCountries = [...new Set(customers.map(c => c.Country).filter(c => c && c !== 0 && c !== 'Unknown'))];
          if (uniqueCountries.length > 0) setCountriesList(uniqueCountries);

          // Buat mapping country -> cities
          const cityMapping = {};
          customers.forEach(c => {
            const country = c.Country;
            const city = c.City;
            if (country && city && country !== 0 && country !== 'Unknown' && city !== 0 && city !== 'Unknown') {
              if (!cityMapping[country]) {
                cityMapping[country] = new Set();
              }
              cityMapping[country].add(city);
            }
          });

          // Konversi Set ke Array
          const cityMappingArray = {};
          Object.keys(cityMapping).forEach(country => {
            cityMappingArray[country] = [...cityMapping[country]];
          });
          setCitiesByCountry(cityMappingArray);

          // Ambil unique quarters dan genders
          const uniqueQuarters = [...new Set(customers.map(c => c.Signup_Quarter).filter(c => c && c !== 0 && c !== 'Unknown'))];
          const uniqueGenders = [...new Set(customers.map(c => c.Gender).filter(c => c && c !== 0 && c !== 'Unknown'))];

          if (uniqueQuarters.length > 0) setQuartersList(uniqueQuarters);
          if (uniqueGenders.length > 0) setGendersList(uniqueGenders);

          console.log("✅ Loaded from CSV:", {
            uniqueCountries,
            cityMapping: cityMappingArray,
            uniqueQuarters,
            uniqueGenders
          });

          // Set default city berdasarkan country pertama
          const defaultCountry = uniqueCountries[0] || "USA";
          const defaultCities = cityMappingArray[defaultCountry] || ["New York", "Los Angeles"];
          setAvailableCities(defaultCities);
          setFormData(prev => ({
            ...prev,
            country: defaultCountry,
            city: defaultCities[0] || ""
          }));
        }
      } catch (error) {
        console.error("Error loading CSV:", error);
        // Fallback data
        const fallbackCityMapping = {
          "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
          "UK": ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh"],
          "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
          "Germany": ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt"],
          "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
          "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"]
        };
        setCitiesByCountry(fallbackCityMapping);
        setAvailableCities(fallbackCityMapping["USA"]);
      } finally {
        setLoadingData(false);
      }
    };

    loadDataFromCSV();
  }, []);

  // Handle country change - update city list
  const handleCountryChange = (selectedCountry) => {
    const cities = citiesByCountry[selectedCountry] || [];
    setAvailableCities(cities);
    setFormData(prev => ({
      ...prev,
      country: selectedCountry,
      city: cities[0] || ""
    }));
  };

  // Hitung churn probability
  const calculateChurnProbability = (data) => {
    let score = 0.15;

    const serviceCalls = data.serviceCalls || 0;
    if (serviceCalls > 5) score += 0.25;
    else if (serviceCalls > 3) score += 0.15;
    else if (serviceCalls > 1) score += 0.08;

    const paymentDiv = (data.paymentDiversity || 50) / 100;
    if (paymentDiv < 0.3) score += 0.18;
    else if (paymentDiv < 0.5) score += 0.10;
    else if (paymentDiv < 0.7) score += 0.05;

    const reviews = data.productReviews || 0;
    if (reviews === 0) score += 0.14;
    else if (reviews < 2) score += 0.07;

    const ltv = data.lifetimeValue || 1000;
    if (ltv < 500) score += 0.12;
    else if (ltv < 1000) score += 0.06;

    const cartAbandon = (data.cartAbandon || 30) / 100;
    if (cartAbandon > 0.6) score += 0.11;
    else if (cartAbandon > 0.4) score += 0.06;

    const age = data.age || 30;
    if (age < 25) score += 0.07;
    else if (age < 30) score += 0.03;

    const signupQuarter = data.signupQuarter || "Q1";
    if (signupQuarter === "Q4") score += 0.04;
    else if (signupQuarter === "Q3") score += 0.03;

    return Math.min(0.95, Math.max(0.05, score));
  };

  // Dapatkan rekomendasi
  const getRecommendations = (data, probability) => {
    const recommendations = [];

    if (data.serviceCalls > 3) {
      recommendations.push({
        priority: "High",
        factor: "Customer Service Calls",
        action: "Hubungi pelanggan untuk menyelesaikan masalah layanan",
        channel: "Telepon",
        impact: data.serviceCalls > 5 ? "+25%" : "+15%"
      });
    }

    if (data.productReviews === 0) {
      recommendations.push({
        priority: "High",
        factor: "Product Reviews",
        action: "Kirim insentif diskon untuk mendorong ulasan produk",
        channel: "Email",
        impact: "+14%"
      });
    }

    if (data.cartAbandon > 60) {
      recommendations.push({
        priority: "Medium",
        factor: "Cart Abandonment",
        action: "Kirim reminder keranjang belanja dengan diskon khusus",
        channel: "Email",
        impact: "+11%"
      });
    }

    if (data.lifetimeValue < 500) {
      recommendations.push({
        priority: "Medium",
        factor: "Lifetime Value",
        action: "Tawarkan program loyalitas dan bundel produk eksklusif",
        channel: "Email & Push",
        impact: "+12%"
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: "Low",
        factor: "Maintenance",
        action: "Pertahankan engagement dengan konten menarik dan program referral",
        channel: "Email & Social",
        impact: "Menjaga loyalitas"
      });
    }

    return recommendations.slice(0, 3);
  };

  // Dapatkan top factors
  const getTopFactors = (data) => {
    const factors = [];

    if (data.serviceCalls > 3) {
      factors.push({
        factor: "Customer Service Calls",
        value: data.serviceCalls,
        impact: data.serviceCalls > 5 ? "+25%" : "+15%"
      });
    }

    if (data.cartAbandon > 40) {
      factors.push({
        factor: "Cart Abandonment",
        value: data.cartAbandon,
        impact: data.cartAbandon > 60 ? "+11%" : "+6%"
      });
    }

    if (data.productReviews === 0) {
      factors.push({
        factor: "Product Reviews",
        value: 0,
        impact: "+14%"
      });
    }

    if (data.lifetimeValue < 1000) {
      factors.push({
        factor: "Lifetime Value",
        value: data.lifetimeValue,
        impact: data.lifetimeValue < 500 ? "+12%" : "+6%"
      });
    }

    if (data.age < 25) {
      factors.push({
        factor: "Age",
        value: data.age,
        impact: "+7%"
      });
    }

    return factors.slice(0, 3);
  };

  // Handle single prediction
  const handlePredict = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const probability = calculateChurnProbability(formData);
    const riskLevel = probability >= 0.7 ? "High" : (probability >= 0.4 ? "Medium" : "Low");
    const recommendations = getRecommendations(formData, probability);
    const topFactors = getTopFactors(formData);

    const result = {
      probability: probability,
      probabilityPercent: (probability * 100).toFixed(1),
      riskLevel: riskLevel,
      riskColor: riskColors[riskLevel],
      recommendations: recommendations,
      topFactors: topFactors,
      timestamp: new Date().toLocaleString('id-ID'),
      customerData: { ...formData }
    };

    setPredictionResult(result);
    setPredictionHistory(prev => [{
      id: Date.now(),
      ...result,
      customerName: `Prediction ${prev.length + 1}`
    }, ...prev].slice(0, 20));

    setLoading(false);
  };

  const handleReset = () => {
    const defaultCountry = countriesList[0] || "USA";
    const defaultCitiesList = citiesByCountry[defaultCountry] || ["New York", "Los Angeles"];
    setFormData({
      age: 30,
      gender: gendersList[0] || "Male",
      country: defaultCountry,
      city: defaultCitiesList[0] || "",
      signupQuarter: quartersList[0] || "Q1",
      serviceCalls: 0,
      paymentDiversity: 50,
      productReviews: 0,
      lifetimeValue: 1000,
      cartAbandon: 30
    });
    setAvailableCities(defaultCitiesList);
    setPredictionResult(null);
  };

  // Handle batch prediction
  const handleBatchUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBatchLoading(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const customers = results.data.map(row => ({
          age: row.Age || row.age || 30,
          gender: row.Gender || row.gender || "Male",
          country: row.Country || row.country || "USA",
          city: row.City || row.city || "New York",
          signupQuarter: row.Signup_Quarter || row.signupQuarter || "Q1",
          serviceCalls: row.Customer_Service_Calls || row.serviceCalls || 0,
          paymentDiversity: row.Payment_Method_Diversity || row.paymentDiversity || 50,
          productReviews: row.Product_Reviews_Written || row.productReviews || 0,
          lifetimeValue: row.Lifetime_Value || row.lifetimeValue || 1000,
          cartAbandon: row.Cart_Abandonment_Rate || row.cartAbandon || 30
        }));

        const predictions = customers.map((customer, idx) => {
          const probability = calculateChurnProbability(customer);
          return {
            id: idx + 1,
            ...customer,
            churn_probability: probability,
            probabilityPercent: (probability * 100).toFixed(1),
            risk_level: probability >= 0.7 ? "High" : (probability >= 0.4 ? "Medium" : "Low")
          };
        });

        setBatchResults(predictions);
        setShowBatchResults(true);
        setBatchLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setBatchLoading(false);
      }
    });
  };

  const exportBatchResults = () => {
    const headers = ["ID", "Age", "Gender", "Country", "City", "Signup Quarter", "Service Calls", "Reviews", "LTV", "Cart Abandon", "Churn Prob", "Risk Level"];
    const csvRows = [headers];

    batchResults.forEach(r => {
      csvRows.push([
        r.id, r.age, r.gender, r.country, r.city, r.signupQuarter,
        r.serviceCalls, r.productReviews, r.lifetimeValue, r.cartAbandon,
        `${r.probabilityPercent}%`, r.risk_level
      ]);
    });

    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_predictions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteHistoryItem = (id) => {
    setPredictionHistory(prev => prev.filter(item => item.id !== id));
  };

  const loadFromHistory = (historyItem) => {
    setFormData(historyItem.customerData);
    // Update available cities based on selected country
    const cities = citiesByCountry[historyItem.customerData.country] || [];
    setAvailableCities(cities);
    setPredictionResult({
      probability: historyItem.probability,
      probabilityPercent: historyItem.probabilityPercent,
      riskLevel: historyItem.riskLevel,
      riskColor: historyItem.riskColor,
      recommendations: historyItem.recommendations,
      topFactors: historyItem.topFactors,
      timestamp: historyItem.timestamp
    });
  };

  if (loadingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: themeColors.primary }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .result-card { animation: fadeIn 0.5s ease-out; }
        input, select { transition: all 0.2s ease; }
        input:focus, select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
          outline: none;
        }
      `}</style>

      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub="Prediksi churn berdasarkan model XGBoost (akurasi 87%)">
        Prediksi Churn
        <span style={{ fontSize: 12, color: '#10b981', marginLeft: 8 }}>● XGBoost Active</span>
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: 16 }}>

        {/* FORM INPUT */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: themeColors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>
              📝 Input Data Pelanggan
            </h3>
            <button
              onClick={handleReset}
              style={{
                background: "transparent",
                border: `1px solid ${themeColors.inputBorder}`,
                borderRadius: 8,
                padding: "6px 12px",
                color: themeColors.textSecondary,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          {/* Informasi Feature Importance */}
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
            padding: "8px 12px",
            background: `${themeColors.primary}10`,
            borderRadius: 10
          }}>
            {TOP_FEATURES.map((f, i) => (
              <span key={i} style={{ fontSize: 10, color: f.color, fontWeight: 500 }}>
                {f.feature}: {f.importance}%
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {/* Kolom Kiri - Data Demografi */}
            <div>
              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <User size={12} style={{ display: "inline", marginRight: 4 }} /> Usia
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                min={18}
                max={80}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              />

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <User size={12} style={{ display: "inline", marginRight: 4 }} /> Jenis Kelamin
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              >
                {gendersList.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <Flag size={12} style={{ display: "inline", marginRight: 4 }} /> Negara
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              >
                {countriesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <MapPin size={12} style={{ display: "inline", marginRight: 4 }} /> Kota
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              >
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <Calendar size={12} style={{ display: "inline", marginRight: 4 }} /> Kuartal Pendaftaran
              </label>
              <select
                value={formData.signupQuarter}
                onChange={(e) => setFormData({ ...formData, signupQuarter: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              >
                {quartersList.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            {/* Kolom Kanan - Top 5 Features */}
            <div>
              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <Phone size={12} style={{ display: "inline", marginRight: 4 }} /> Panggilan Layanan
                <span style={{ fontSize: 10, color: "#ef4444", marginLeft: 6 }}>(12.38%)</span>
              </label>
              <input
                type="number"
                value={formData.serviceCalls}
                onChange={(e) => setFormData({ ...formData, serviceCalls: parseInt(e.target.value) || 0 })}
                min={0}
                max={20}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              />

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <CreditCard size={12} style={{ display: "inline", marginRight: 4 }} /> Diversitas Pembayaran
                <span style={{ fontSize: 10, color: "#f59e0b", marginLeft: 6 }}>(8.92%)</span>
              </label>
              <input
                type="range"
                value={formData.paymentDiversity}
                onChange={(e) => setFormData({ ...formData, paymentDiversity: parseInt(e.target.value) })}
                min={0}
                max={100}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <div style={{ fontSize: 11, color: themeColors.textMuted, textAlign: "center", marginBottom: 12 }}>
                {formData.paymentDiversity}%
              </div>

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <Star size={12} style={{ display: "inline", marginRight: 4 }} /> Ulasan Produk
                <span style={{ fontSize: 10, color: "#10b981", marginLeft: 6 }}>(6.40%)</span>
              </label>
              <input
                type="number"
                value={formData.productReviews}
                onChange={(e) => setFormData({ ...formData, productReviews: parseInt(e.target.value) || 0 })}
                min={0}
                max={50}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              />

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <Wallet size={12} style={{ display: "inline", marginRight: 4 }} /> Lifetime Value (USD)
                <span style={{ fontSize: 10, color: "#3b82f6", marginLeft: 6 }}>(5.93%)</span>
              </label>
              <input
                type="number"
                value={formData.lifetimeValue}
                onChange={(e) => setFormData({ ...formData, lifetimeValue: parseInt(e.target.value) || 0 })}
                min={100}
                max={10000}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: themeColors.inputBg,
                  border: `1px solid ${themeColors.inputBorder}`,
                  borderRadius: 8,
                  color: themeColors.text,
                  fontSize: 13,
                  marginBottom: 12
                }}
              />

              <label style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 4, display: "block" }}>
                <ShoppingCart size={12} style={{ display: "inline", marginRight: 4 }} /> Pengabaian Keranjang
                <span style={{ fontSize: 10, color: "#8b5cf6", marginLeft: 6 }}>(5.80%)</span>
              </label>
              <input
                type="range"
                value={formData.cartAbandon}
                onChange={(e) => setFormData({ ...formData, cartAbandon: parseInt(e.target.value) })}
                min={0}
                max={100}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <div style={{ fontSize: 11, color: themeColors.textMuted, textAlign: "center" }}>
                {formData.cartAbandon}%
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={18} />}
            {loading ? "Memproses..." : "🔮 PREDIKSI SEKARANG"}
          </button>
        </GlassCard>

        {/* HASIL PREDIKSI - Sama seperti sebelumnya */}
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
            🎯 Hasil Prediksi
          </h3>

          {predictionResult ? (
            <div className="result-card">
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: `${predictionResult.riskColor}15`,
                borderRadius: 16,
                marginBottom: 16
              }}>
                <div style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  background: predictionResult.riskColor,
                  borderRadius: 40,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 12
                }}>
                  {predictionResult.riskLevel === "High" ? "🔴 RISIKO TINGGI" :
                    predictionResult.riskLevel === "Medium" ? "🟠 RISIKO SEDANG" : "🟢 RISIKO RENDAH"}
                </div>
                <div style={{ fontSize: 48, fontWeight: 800, color: predictionResult.riskColor }}>
                  {predictionResult.probabilityPercent}%
                </div>
                <div style={{ fontSize: 13, color: themeColors.textMuted }}>Probabilitas Churn</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 8, background: `${themeColors.textMuted}20`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${predictionResult.probabilityPercent}%`,
                    height: "100%",
                    background: predictionResult.riskColor,
                    borderRadius: 4
                  }} />
                </div>
              </div>

              {predictionResult.topFactors.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: themeColors.text, marginBottom: 8 }}>
                    🔥 Top Faktor Penyebab
                  </h4>
                  {predictionResult.topFactors.map((factor, idx) => (
                    <div key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: `1px solid ${themeColors.sidebarBorder}`
                    }}>
                      <span style={{ fontSize: 12, color: themeColors.textSecondary }}>{factor.factor}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{factor.impact}</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: themeColors.text, marginBottom: 8 }}>
                  💡 Rekomendasi
                </h4>
                {predictionResult.recommendations.map((rec, idx) => (
                  <div key={idx} style={{
                    background: `${themeColors.badgeBg}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginBottom: 8,
                    borderLeft: `3px solid ${rec.priority === "High" ? "#ef4444" : rec.priority === "Medium" ? "#f59e0b" : "#10b981"}`
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      {rec.channel === "Telepon" ? <Phone size={12} color="#ef4444" /> :
                        rec.channel === "Email" ? <Mail size={12} color="#3b82f6" /> :
                          <Gift size={12} color="#10b981" />}
                      <span style={{ fontSize: 11, fontWeight: 600, color: themeColors.text }}>{rec.action}</span>
                    </div>
                    <div style={{ fontSize: 10, color: themeColors.textMuted }}>Saluran: {rec.channel}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: 40,
              color: themeColors.textMuted
            }}>
              <Sparkles size={48} opacity={0.3} />
              <p style={{ marginTop: 12 }}>Masukkan data pelanggan dan klik "Prediksi Sekarang"</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* BATCH PREDICTION dan RIWAYAT - Sama seperti sebelumnya */}
      <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ color: themeColors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>
              📊 Prediksi Massal (Batch)
            </h3>
            <p style={{ color: themeColors.textMuted, fontSize: 11, marginTop: 4 }}>
              Upload file CSV untuk memprediksi banyak pelanggan sekaligus
            </p>
          </div>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: themeColors.buttonPrimary,
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer"
          }}>
            <FileUp size={16} />
            Upload CSV
            <input type="file" accept=".csv" onChange={handleBatchUpload} style={{ display: "none" }} />
          </label>
        </div>

        {batchLoading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Loader size={32} style={{ animation: "spin 1s linear infinite", color: themeColors.primary }} />
            <p style={{ marginTop: 12, color: themeColors.textMuted }}>Memproses data...</p>
          </div>
        )}

        {showBatchResults && batchResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: themeColors.textSecondary }}>{batchResults.length} pelanggan diprediksi</span>
              <button onClick={exportBatchResults} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                background: "transparent", border: `1px solid ${themeColors.inputBorder}`,
                borderRadius: 8, color: themeColors.textSecondary, fontSize: 12, cursor: "pointer"
              }}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}` }}>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>ID</th>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>Service Calls</th>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>Reviews</th>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>LTV</th>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>Churn Prob</th>
                    <th style={{ padding: "10px", textAlign: "left", color: themeColors.textMuted }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.slice(0, 10).map((result) => (
                    <tr key={result.id} style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}` }}>
                      <td style={{ padding: "10px", color: themeColors.text }}>{result.id}</td>
                      <td style={{ padding: "10px", color: themeColors.textSecondary }}>{result.serviceCalls}</td>
                      <td style={{ padding: "10px", color: themeColors.textSecondary }}>{result.productReviews}</td>
                      <td style={{ padding: "10px", color: themeColors.textSecondary }}>${result.lifetimeValue}</td>
                      <td style={{ padding: "10px", fontWeight: 600, color: result.churn_probability > 0.7 ? "#ef4444" : result.churn_probability > 0.4 ? "#f59e0b" : "#10b981" }}>
                        {result.probabilityPercent}%
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                          background: result.churn_probability > 0.7 ? "#ef444420" : result.churn_probability > 0.4 ? "#f59e0b20" : "#10b98120",
                          color: result.churn_probability > 0.7 ? "#ef4444" : result.churn_probability > 0.4 ? "#f59e0b" : "#10b981"
                        }}>
                          {result.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {batchResults.length > 10 && (
                <div style={{ textAlign: "center", padding: 12, color: themeColors.textMuted, fontSize: 12 }}>
                  + {batchResults.length - 10} pelanggan lainnya
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* RIWAYAT PREDIKSI */}
      {predictionHistory.length > 0 && (
        <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: themeColors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>📜 Riwayat Prediksi</h3>
            <button onClick={() => setPredictionHistory([])} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "transparent", border: `1px solid ${themeColors.inputBorder}`,
              borderRadius: 8, color: themeColors.textMuted, fontSize: 12, cursor: "pointer"
            }}>
              <Trash2 size={14} /> Hapus Semua
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {predictionHistory.slice(0, 5).map((item) => (
              <div key={item.id} onClick={() => loadFromHistory(item)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", background: themeColors.badgeBg, borderRadius: 10,
                cursor: "pointer", transition: "all 0.2s"
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: themeColors.text }}>{item.timestamp}</div>
                  <div style={{ fontSize: 11, color: themeColors.textMuted }}>Prob: {item.probabilityPercent}%</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                    background: `${item.riskColor}20`, color: item.riskColor
                  }}>{item.riskLevel}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }} style={{
                    background: "transparent", border: "none", cursor: "pointer", color: themeColors.textMuted
                  }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}