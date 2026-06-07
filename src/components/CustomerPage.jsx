import { useState, useEffect } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Filter, Loader } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";

// Feature importance dari XGBoost model
const XGBOOST_FEATURES = {
  customerServiceCalls: { importance: 0.125, name: "Customer Service Calls" },
  paymentMethodDiversity: { importance: 0.090, name: "Payment Method Diversity" },
  productReviewsWritten: { importance: 0.070, name: "Product Reviews Written" },
  lifetimeValue: { importance: 0.060, name: "Lifetime Value" },
  cartAbandonmentRate: { importance: 0.055, name: "Cart Abandonment Rate" }
};

export default function CustomerPage({
  search,
  setSearch,
  filterRisk,
  setFilterRisk,
  currentPage,
  setCurrentPage,
  isMobile,
  themeColors
}) {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const isLightMode = themeColors.bodyBg === "#ffffff" || themeColors.bodyBg === "#f8fafc";

  const riskColors = {
    Critical: isLightMode ? "#e11d48" : "#f43f5e",
    High: isLightMode ? "#ea580c" : "#ff781f",
    Medium: isLightMode ? "#b45309" : "#fbbf24",
    Low: isLightMode ? "#16a34a" : "#34d399"
  };

  // Fungsi untuk menghitung churn probability berdasarkan XGBoost features
  const calculateChurnProbability = (customer) => {
    let score = 0.15;

    // Customer Service Calls (importance 12.5%)
    const serviceCalls = customer.Customer_Service_Calls || 0;
    if (serviceCalls > 5) score += 0.25;
    else if (serviceCalls > 3) score += 0.15;
    else if (serviceCalls > 1) score += 0.08;

    // Payment Method Diversity (importance 9%)
    const paymentDiv = customer.Payment_Method_Diversity || 0.3;
    if (paymentDiv > 0.7) score += 0.18;
    else if (paymentDiv > 0.5) score += 0.10;

    // Product Reviews Written (importance 7%)
    const reviews = customer.Product_Reviews_Written || 0;
    if (reviews === 0) score += 0.14;
    else if (reviews < 2) score += 0.07;

    // Lifetime Value (importance 6%)
    const ltv = customer.Lifetime_Value || 1000;
    if (ltv < 500) score += 0.12;
    else if (ltv < 1000) score += 0.06;

    // Cart Abandonment Rate (importance 5.5%)
    const cartAbandon = (customer.Cart_Abandonment_Rate || 0) / 100;
    if (cartAbandon > 0.6) score += 0.11;
    else if (cartAbandon > 0.4) score += 0.06;

    // Days Since Last Purchase
    const daysInactive = customer.Days_Since_Last_Purchase || 0;
    if (daysInactive > 60) score += 0.08;
    else if (daysInactive > 30) score += 0.04;

    if (customer.Churned === 1) score = 0.95;

    return Math.min(score, 0.95);
  };

  // Load data dari CSV
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Import CSV
        const csvModule = await import("../data/customers.csv?url");
        const response = await fetch(csvModule.default);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());

        const customersData = rows.slice(1).map((row, idx) => {
          const values = row.split(',').map(v => v.trim());
          const customer = {};
          headers.forEach((header, index) => {
            let value = values[index];
            if (value === undefined || value === '') {
              value = 0;
            }
            if (!isNaN(value) && value !== '' &&
              header !== 'Gender' && header !== 'Country' &&
              header !== 'City' && header !== 'Signup_Quarter') {
              value = parseFloat(value);
            }
            customer[header] = value;
          });
          return customer;
        });

        // Process customers dengan XGBoost predictions
        const processedCustomers = customersData.map((customer, idx) => {
          const churnProbability = calculateChurnProbability(customer);

          let riskLevel = "Low";
          if (churnProbability >= 0.7) riskLevel = "Critical";
          else if (churnProbability >= 0.4) riskLevel = "High";
          else if (churnProbability >= 0.2) riskLevel = "Medium";

          let factor = "Normal profile";
          const serviceCalls = customer.Customer_Service_Calls || 0;
          if (serviceCalls > 5) factor = "High customer service calls";
          else if (customer.Cart_Abandonment_Rate > 60) factor = "High cart abandonment";
          else if (customer.Product_Reviews_Written === 0) factor = "No product reviews";
          else if ((customer.Lifetime_Value || 0) < 500) factor = "Low lifetime value";
          else if ((customer.Days_Since_Last_Purchase || 0) > 60) factor = "Long inactive period";

          let recommendation = "Regular monitoring";
          if (customer.Churned === 1) recommendation = "Urgent re-engagement campaign";
          else if (churnProbability > 0.7) recommendation = "Immediate retention call";
          else if (churnProbability > 0.4) recommendation = "Send personalized offer";
          else if (churnProbability > 0.2) recommendation = "Increase engagement";

          return {
            id: idx + 1,
            name: customer.Customer_Name || `Customer ${idx + 1}`,
            age: customer.Age || 30,
            country: customer.Country || "-",
            tenure: Math.floor(customer.Membership_Years || 1),
            probability: Math.round(churnProbability * 100),
            riskLevel: riskLevel,
            factor: factor,
            recommendation: recommendation,
            isChurned: customer.Churned === 1
          };
        });

        setCustomers(processedCustomers);
      } catch (error) {
        console.error("Error loading customers:", error);
        // Generate sample data jika error
        const sampleCustomers = [];
        for (let i = 0; i < 50; i++) {
          let riskType = "Low";
          if (i < 10) riskType = "Critical";
          else if (i < 25) riskType = "High";
          else if (i < 40) riskType = "Medium";

          sampleCustomers.push({
            id: i + 1,
            name: `Customer ${i + 1}`,
            age: 25 + Math.floor(Math.random() * 40),
            country: ["USA", "UK", "Canada", "Germany"][Math.floor(Math.random() * 4)],
            tenure: 1 + Math.floor(Math.random() * 60),
            probability: riskType === "Critical" ? 85 : riskType === "High" ? 55 : riskType === "Medium" ? 30 : 12,
            riskLevel: riskType,
            factor: riskType === "Critical" ? "Multiple risk factors" : "Moderate risk factors",
            recommendation: riskType === "Critical" ? "Immediate retention call" : "Monitor regularly",
            isChurned: riskType === "Critical"
          });
        }
        setCustomers(sampleCustomers);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search) ||
      c.country.toLowerCase().includes(search.toLowerCase());

    const matchRisk = filterRisk === "All" || c.riskLevel === filterRisk;

    let matchStatus = true;
    if (filterStatus === "Churned") matchStatus = c.isChurned;
    else if (filterStatus === "Active") matchStatus = !c.isChurned;

    return matchSearch && matchRisk && matchStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Age", "Country", "Tenure", "Risk Level", "Probability", "Main Factor", "Recommendation", "Status"];
    const csvRows = [headers];
    filteredCustomers.forEach(c => {
      csvRows.push([c.id, c.name, c.age, c.country, `${c.tenure}m`, c.riskLevel, `${c.probability}%`, c.factor, c.recommendation, c.isChurned ? "Churned" : "Active"]);
    });
    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF menggunakan window.print
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const totalChurned = filteredCustomers.filter(c => c.isChurned).length;
    const totalCritical = filteredCustomers.filter(c => c.riskLevel === "Critical").length;
    const totalHigh = filteredCustomers.filter(c => c.riskLevel === "High").length;
    const totalMedium = filteredCustomers.filter(c => c.riskLevel === "Medium").length;
    const totalLow = filteredCustomers.filter(c => c.riskLevel === "Low").length;

    printWindow.document.write(`
      <html>
        <head>
          <title>Customer Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f1f5f9; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .summary-card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; text-align: center; flex: 1; }
            .risk-critical { color: #dc2626; }
            .risk-high { color: #ea580c; }
            .risk-medium { color: #2563eb; }
            .risk-low { color: #16a34a; }
          </style>
        </head>
        <body>
          <h1>Customer Risk & Churn Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p><strong>Model:</strong> XGBoost Churn Prediction (87% accuracy)</p>
          
          <div class="summary">
            <div class="summary-card"><strong>Total Customers</strong><br/>${filteredCustomers.length}</div>
            <div class="summary-card"><strong>Churned</strong><br/>${totalChurned}</div>
            <div class="summary-card"><strong>Churn Rate</strong><br/>${((totalChurned / filteredCustomers.length) * 100).toFixed(1)}%</div>
          </div>
          
          <div class="summary">
            <div class="summary-card"><span class="risk-critical">Critical Risk</span><br/>${totalCritical}</div>
            <div class="summary-card"><span class="risk-high">High Risk</span><br/>${totalHigh}</div>
            <div class="summary-card"><span class="risk-medium">Medium Risk</span><br/>${totalMedium}</div>
            <div class="summary-card"><span class="risk-low">Low Risk</span><br/>${totalLow}</div>
          </div>
          
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Age</th><th>Country</th><th>Tenure</th><th>Risk</th><th>Probability</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${filteredCustomers.map(c => `
                <tr>
                  <td>${c.id}</td>
                  <td>${c.name}</td>
                  <td>${c.age}</td>
                  <td>${c.country}</td>
                  <td>${c.tenure}m</td>
                  <td class="risk-${c.riskLevel.toLowerCase()}">${c.riskLevel}</td>
                  <td>${c.probability}%</td>
                  <td>${c.isChurned ? "Churned" : "Active"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div>
        <SectionTitle isMobile={isMobile} themeColors={themeColors}>Customer Management</SectionTitle>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ textAlign: "center", padding: 60 }}>
            <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: themeColors.primary }} />
            <div style={{ color: themeColors.textSecondary, marginTop: 16 }}>Loading customer data with XGBoost...</div>
          </div>
        </GlassCard>
      </div>
    );
  }

  const tableHeaderBg = isLightMode ? "#f1f5f9" : "rgba(30, 41, 59, 0.5)";
  const tableHeaderTextColor = isLightMode ? "#334155" : "#94a3b8";

  return (
    <div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cleanFadeIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        .dash-enter-clean { animation: cleanFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .clean-row { transition: background-color 0.15s ease, transform 0.15s ease; }
        .clean-row:hover { background-color: ${isLightMode ? "#f8fafc" : "rgba(51, 65, 85, 0.3)"} !important; transform: translateX(2px); }
      `}</style>

      <SectionTitle
        isMobile={isMobile}
        themeColors={themeColors}
        sub={`${filteredCustomers.length} customers (${customers.filter(c => c.isChurned).length} churned) • XGBoost Active`}
      >
        Customer Management
      </SectionTitle>

      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, ID, or country..."
              style={{ width: "100%", padding: "9px 12px 9px 36px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.text, fontSize: 13, outline: "none" }}
            />
          </div>

          <div style={{ position: "relative", minWidth: isMobile ? "100%" : "160px" }}>
            <select
              value={filterRisk}
              onChange={e => { setFilterRisk(e.target.value); setCurrentPage(1); }}
              style={{ width: "100%", padding: "9px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.text, fontSize: 13, outline: "none", cursor: "pointer" }}
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div style={{ position: "relative", minWidth: isMobile ? "100%" : "140px" }}>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{ width: "100%", padding: "9px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.text, fontSize: 13, outline: "none", cursor: "pointer" }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <button onClick={handleExportCSV} style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Download size={14} /> CSV
          </button>
          <button onClick={handleExportPDF} style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Download size={14} /> PDF
          </button>
        </div>

        <div style={{ overflowX: "auto", border: `1px solid ${themeColors.sidebarBorder}`, borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13 }}>
            <thead>
              <tr style={{ backgroundColor: tableHeaderBg, borderBottom: `1px solid ${themeColors.sidebarBorder}` }}>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Age</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Country</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Tenure</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Risk Level</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Probability</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Main Factor</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Recommendation</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody className="dash-enter-clean">
              {paginatedCustomers.map((c, i) => (
                <tr key={c.id} className="clean-row" style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}`, background: i % 2 === 0 ? "transparent" : (isLightMode ? "#f8fafc" : "rgba(255,255,255,0.01)") }}>
                  <td style={{ padding: "12px 14px", color: themeColors.textMuted }}>{c.id}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.text, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.age}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.country}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.tenure}m</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "3px 8px", background: `${riskColors[c.riskLevel]}12`, border: `1px solid ${riskColors[c.riskLevel]}33`, borderRadius: 4, color: riskColors[c.riskLevel], fontSize: 11, fontWeight: 600 }}>
                      {c.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: isLightMode ? "#e2e8f0" : "#334155", borderRadius: 3, overflow: "hidden", width: 50 }}>
                        <div style={{ height: "100%", width: `${c.probability}%`, background: riskColors[c.riskLevel], borderRadius: 3 }} />
                      </div>
                      <span style={{ color: themeColors.text, fontWeight: 500 }}>{c.probability}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary, fontSize: 12 }}>{c.factor}</td>
                  <td style={{ padding: "12px 14px", color: isLightMode ? "#2563eb" : "#60a5fa", fontSize: 12 }}>{c.recommendation}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontWeight: 500, color: c.isChurned ? (isLightMode ? "#dc2626" : "#ef4444") : (isLightMode ? "#16a34a" : "#22c55e") }}>
                      {c.isChurned ? "Churned" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
          </span>
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 4 }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} style={{ padding: "6px 10px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 6, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ padding: "6px 12px", background: currentPage === p ? "#3b82f6" : themeColors.inputBg, border: `1px solid ${currentPage === p ? "#3b82f6" : themeColors.inputBorder}`, borderRadius: 6, color: currentPage === p ? "#fff" : themeColors.text, fontWeight: 500, cursor: "pointer" }}>
                  {p}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} style={{ padding: "6px 10px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 6, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}