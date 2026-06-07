import { useState, useEffect } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import html2pdf from "html2pdf.js";

// DATA DARI CSV (150 BARIS)
const generateSampleData = () => {
  const baseData = [
    { Age: 43, Gender: "male", Country: "France", Days: 46.4, Credit: 2278, Returns: 2.0, Lifetime: 953.33, Total: 94.72, Churned: 0 },
    { Age: 36, Gender: "male", Country: "UK", Days: 57.96, Credit: 3028, Returns: 9.2, Lifetime: 1067.47, Total: 82.45, Churned: 0 },
    { Age: 45, Gender: "female", Country: "Canada", Days: 12.24, Credit: 2317, Returns: 11.5, Lifetime: 1289.75, Total: 165.52, Churned: 0 },
    { Age: 35, Gender: "male", Country: "Japan", Days: 60.2, Credit: 2418, Returns: 11.0, Lifetime: 1995.43, Total: 190.97, Churned: 1 },
    { Age: 47, Gender: "female", Country: "USA", Days: 77.16, Credit: 2274, Returns: 6.3, Lifetime: 1394.04, Total: 161.98, Churned: 0 },
    { Age: 32, Gender: "male", Country: "Canada", Days: 1.8, Credit: 534, Returns: 9.9, Lifetime: 537.21, Total: 77.79, Churned: 0 },
    { Age: 44, Gender: "male", Country: "USA", Days: 65.5, Credit: 977, Returns: 5.4, Lifetime: 807.84, Total: 90.95, Churned: 0 },
    { Age: 32, Gender: "male", Country: "UK", Days: 46.2, Credit: 498, Returns: 5.1, Lifetime: 599.41, Total: 118.0, Churned: 1 },
    { Age: 32, Gender: "female", Country: "Germany", Days: 72.0, Credit: 1369, Returns: 4.8, Lifetime: 335.92, Total: 78.88, Churned: 1 },
    { Age: 40, Gender: "female", Country: "USA", Days: 59.0, Credit: 2446, Returns: 1.9, Lifetime: 1229.94, Total: 123.99, Churned: 0 },
    { Age: 18, Gender: "female", Country: "USA", Days: 22.9, Credit: 2772, Returns: 0.2, Lifetime: 1083.91, Total: 107.58, Churned: 1 },
    { Age: 18, Gender: "female", Country: "France", Days: 40.0, Credit: 3624, Returns: 3.7, Lifetime: 1618.51, Total: 123.0, Churned: 0 },
    { Age: 25, Gender: "female", Country: "Canada", Days: 42.6, Credit: 1048, Returns: 7.0, Lifetime: 503.26, Total: 116.39, Churned: 0 },
    { Age: 41, Gender: "male", Country: "USA", Days: 40.2, Credit: 1924, Returns: 8.0, Lifetime: 1356.93, Total: 107.78, Churned: 0 },
    { Age: 21, Gender: "female", Country: "Australia", Days: 40.2, Credit: 3107, Returns: 14.0, Lifetime: 1274.7, Total: 80.88, Churned: 0 },
    { Age: 35, Gender: "male", Country: "USA", Days: 35.04, Credit: 1896, Returns: 9.5, Lifetime: 644.58, Total: 118.84, Churned: 1 },
    { Age: 38, Gender: "male", Country: "Japan", Days: 25.8, Credit: 4088, Returns: 1.6, Lifetime: 2051.85, Total: 144.17, Churned: 0 },
    { Age: 39, Gender: "female", Country: "UK", Days: 50.9, Credit: 2511, Returns: 16.2, Lifetime: 1846.48, Total: 218.46, Churned: 0 },
    { Age: 38, Gender: "female", Country: "Japan", Days: 40.08, Credit: 1735, Returns: 5.8, Lifetime: 684.73, Total: 63.28, Churned: 0 },
    { Age: 38, Gender: "female", Country: "USA", Days: 45.5, Credit: 3002, Returns: 7.5, Lifetime: 1709.74, Total: 131.02, Churned: 0 },
    { Age: 30, Gender: "male", Country: "Germany", Days: 13.9, Credit: 2990, Returns: 7.5, Lifetime: 2954.9, Total: 152.89, Churned: 0 },
    { Age: 34, Gender: "male", Country: "Japan", Days: 32.3, Credit: 1889, Returns: 5.9, Lifetime: 1226.33, Total: 65.22, Churned: 0 },
    { Age: 30, Gender: "male", Country: "Germany", Days: 23.6, Credit: 240, Returns: 5.4, Lifetime: 1585.98, Total: 136.06, Churned: 0 },
    { Age: 25, Gender: "male", Country: "Japan", Days: 40.8, Credit: 3723, Returns: 7.2, Lifetime: 2672.57, Total: 172.03, Churned: 1 },
    { Age: 47, Gender: "male", Country: "Germany", Days: 18.4, Credit: 1736, Returns: 4.2, Lifetime: 257.65, Total: 45.35, Churned: 0 },
    { Age: 23, Gender: "male", Country: "UK", Days: 40.2, Credit: 2564, Returns: 3.8, Lifetime: 1024.65, Total: 77.1, Churned: 0 },
    { Age: 40, Gender: "male", Country: "USA", Days: 62.0, Credit: 2966, Returns: 7.9, Lifetime: 1506.54, Total: 145.04, Churned: 0 },
    { Age: 46, Gender: "male", Country: "France", Days: 32.16, Credit: 1926, Returns: 6.0, Lifetime: 1256.34, Total: 81.06, Churned: 0 },
    { Age: 40, Gender: "female", Country: "UK", Days: 65.3, Credit: 2753, Returns: 3.5, Lifetime: 935.84, Total: 61.15, Churned: 0 },
    { Age: 36, Gender: "male", Country: "USA", Days: 47.8, Credit: 1416, Returns: 2.1, Lifetime: 1133.62, Total: 199.48, Churned: 0 },
    { Age: 38, Gender: "male", Country: "France", Days: 12.4, Credit: 2254, Returns: 10.2, Lifetime: 1294.69, Total: 85.47, Churned: 0 },
    { Age: 29, Gender: "female", Country: "USA", Days: 9.3, Credit: 1098, Returns: 8.3, Lifetime: 1851.75, Total: 121.7, Churned: 0 },
    { Age: 50, Gender: "female", Country: "USA", Days: 45.84, Credit: 442, Returns: 6.4, Lifetime: 837.92, Total: 68.54, Churned: 0 },
    { Age: 42, Gender: "male", Country: "Australia", Days: 34.1, Credit: 4038, Returns: 0.9, Lifetime: 907.62, Total: 122.66, Churned: 0 },
    { Age: 41, Gender: "male", Country: "UK", Days: 40.2, Credit: 2737, Returns: 5.9, Lifetime: 870.26, Total: 76.83, Churned: 0 },
    { Age: 33, Gender: "male", Country: "India", Days: 26.0, Credit: 1165, Returns: 1.4, Lifetime: 692.85, Total: 101.11, Churned: 0 },
    { Age: 29, Gender: "female", Country: "Canada", Days: 63.48, Credit: 1205, Returns: 2.7, Lifetime: 1852.41, Total: 204.64, Churned: 0 },
    { Age: 38, Gender: "male", Country: "Australia", Days: 34.7, Credit: 1416, Returns: 5.3, Lifetime: 486.6, Total: 53.47, Churned: 0 },
    { Age: 50, Gender: "female", Country: "USA", Days: 23.6, Credit: 2319, Returns: 9.5, Lifetime: 1059.04, Total: 69.44, Churned: 0 },
    { Age: 27, Gender: "male", Country: "UK", Days: 37.8, Credit: 206, Returns: 6.2, Lifetime: 826.32, Total: 121.17, Churned: 1 },
    { Age: 41, Gender: "female", Country: "USA", Days: 40.2, Credit: 1704, Returns: 5.1, Lifetime: 392.62, Total: 60.9, Churned: 0 },
    { Age: 35, Gender: "male", Country: "USA", Days: 62.2, Credit: 21, Returns: 5.4, Lifetime: 1125.37, Total: 142.89, Churned: 0 },
    { Age: 24, Gender: "male", Country: "Germany", Days: 34.92, Credit: 2218, Returns: 4.9, Lifetime: 984.68, Total: 103.77, Churned: 0 },
    { Age: 23, Gender: "male", Country: "Germany", Days: 60.5, Credit: 3218, Returns: 3.4, Lifetime: 959.75, Total: 82.7, Churned: 0 },
    { Age: 47, Gender: "female", Country: "USA", Days: 40.2, Credit: 4181, Returns: 5.4, Lifetime: 1717.65, Total: 102.42, Churned: 0 },
    { Age: 37, Gender: "male", Country: "USA", Days: 16.9, Credit: 1, Returns: 16.6, Lifetime: 1333.02, Total: 119.3, Churned: 0 },
    { Age: 50, Gender: "male", Country: "USA", Days: 32.04, Credit: 2366, Returns: 13.1, Lifetime: 2051.75, Total: 141.59, Churned: 0 },
    { Age: 42, Gender: "male", Country: "UK", Days: 40.2, Credit: 1896, Returns: 11.4, Lifetime: 1694.95, Total: 80.27, Churned: 0 },
    { Age: 30, Gender: "male", Country: "France", Days: 65.64, Credit: 1896, Returns: 14.4, Lifetime: 2763.37, Total: 153.4, Churned: 1 },
    { Age: 56, Gender: "male", Country: "UK", Days: 57.5, Credit: 728, Returns: 3.5, Lifetime: 922.74, Total: 88.03, Churned: 0 },
  ];

  const allData = [...baseData];
  const countries = ["France", "UK", "Canada", "USA", "Japan", "Germany", "Australia", "India"];
  const genders = ["male", "female"];

  for (let i = baseData.length; i < 150; i++) {
    const template = baseData[i % baseData.length];
    allData.push({
      Age: Math.max(18, Math.min(70, template.Age + (i % 7) - 3)),
      Gender: genders[i % 2],
      Country: countries[i % countries.length],
      Days: Math.max(0.5, template.Days + (i % 20) - 10),
      Credit: Math.max(100, template.Credit + (i % 1000) - 500),
      Returns: Math.max(0, template.Returns + (i % 8) - 4),
      Lifetime: Math.max(100, template.Lifetime + (i % 1000) - 500),
      Total: Math.max(20, template.Total + (i % 80) - 40),
      Churned: (i % 12 === 0 || i % 25 === 0) ? 1 : 0
    });
  }

  return allData;
};

const sampleData = generateSampleData();

const getRandomName = (gender, index) => {
  const maleNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua",
    "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob",
    "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
    "Samuel", "Gregory", "Frank", "Alexander", "Raymond", "Patrick", "Jack", "Dennis", "Jerry", "Tyler"
  ];

  const femaleNames = [
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Lisa", "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle",
    "Carol", "Amanda", "Dorothy", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
    "Kathleen", "Amy", "Shirley", "Angela", "Helen", "Anna", "Brenda", "Pamela", "Nicole", "Emma",
    "Samantha", "Katherine", "Christine", "Debra", "Rachel", "Carolyn", "Janet", "Catherine", "Maria", "Heather"
  ];

  return gender === "male" ? maleNames[index % maleNames.length] : femaleNames[index % femaleNames.length];
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
  const [filterStatus, setFilterStatus] = useState("All"); // status dikelola sendiri di sini

  // Cek mode kecerahan
  const isLightMode = themeColors.bodyBg === "#ffffff" || themeColors.bodyBg === "#f8fafc" || themeColors.text === "#0f172a" || themeColors.text === "#1e293b";

  // Skema warna kombinasi: Merah (Critical), Oranye (High), Kuning Amber (Medium)
  const riskColors = {
    Critical: isLightMode ? "#e11d48" : "#f43f5e",
    High: isLightMode ? "#ea580c" : "#ff781f",
    Medium: isLightMode ? "#b45309" : "#fbbf24",
    Low: isLightMode ? "#16a34a" : "#34d399"
  };

  useEffect(() => {
    const processedData = sampleData.map((row, idx) => {
      let probability = 0;

      const returns = row.Returns || 0;
      probability += Math.min(35, returns * 2.5);

      const credit = row.Credit || 0;
      if (credit < 500) probability += 25;
      else if (credit < 1000) probability += 15;
      else if (credit < 2000) probability += 8;

      const days = row.Days || 0;
      if (days < 10) probability += 30;
      else if (days < 30) probability += 15;

      const lifetime = row.Lifetime || 0;
      if (lifetime < 500) probability += 20;

      const total = row.Total || 0;
      if (total < 50) probability += 15;

      if (row.Churned === 1) probability = 95;
      probability = Math.min(100, Math.max(0, Math.round(probability)));

      let riskLevel = "Low";
      if (probability >= 70) riskLevel = "Critical";
      else if (probability >= 40) riskLevel = "High";
      else if (probability >= 20) riskLevel = "Medium";

      if (row.Churned === 1) riskLevel = "Critical";

      let factor = "Normal profile";
      if (returns > 15) factor = "High return rate";
      else if (credit < 500) factor = "Low credit score";
      else if (days < 10) factor = "Very low activity";
      else if (days < 30) factor = "Low activity";
      else if (lifetime < 500) factor = "Low lifetime value";
      else if (total < 50) factor = "Low purchase amount";
      else if (probability > 70) factor = "Multiple risk factors";
      else if (probability > 40) factor = "Moderate risk factors";

      let recommendation = "Regular monitoring";
      if (row.Churned === 1) recommendation = "Urgent re-engagement campaign";
      else if (probability > 70) recommendation = "Immediate retention call";
      else if (probability > 40) recommendation = "Send personalized offer";
      else if (probability > 20) recommendation = "Monitor & engage regularly";

      return {
        id: idx + 1,
        name: getRandomName(row.Gender, idx),
        age: row.Age || 30,
        country: row.Country || "-",
        tenure: Math.max(1, Math.floor(days / 30)),
        probability: probability,
        riskLevel: riskLevel,
        factor: factor,
        recommendation: recommendation,
        isChurned: row.Churned === 1
      };
    });

    setCustomers(processedData);
    loading && setLoading(false);
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search) ||
      c.country.toLowerCase().includes(search.toLowerCase());

    const matchRisk = filterRisk === "All" || c.riskLevel === filterRisk;

    // Logika filter status
    let matchStatus = true;
    if (filterStatus === "Churned") matchStatus = c.isChurned;
    else if (filterStatus === "Active") matchStatus = !c.isChurned;

    return matchSearch && matchRisk && matchStatus;
  });

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

  const handleExportPDF = () => {
    const totalChurned = filteredCustomers.filter(c => c.isChurned).length;
    const totalCritical = filteredCustomers.filter(c => c.riskLevel === "Critical").length;
    const totalHigh = filteredCustomers.filter(c => c.riskLevel === "High").length;
    const totalMedium = filteredCustomers.filter(c => c.riskLevel === "Medium").length;
    const totalLow = filteredCustomers.filter(c => c.riskLevel === "Low").length;

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #1e293b;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 4px;">Customer Risk & Churn Report</h1>
        <div style="color: #64748b; font-size: 13px; margin-bottom: 24px;">Generated on ${new Date().toLocaleString()}</div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between;">
          <div><strong>Total Customers Evaluated:</strong> ${filteredCustomers.length}</div>
          <div><strong>Active Churn Case:</strong> ${totalChurned} (${((totalChurned/filteredCustomers.length)*100).toFixed(1)}%)</div>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; flex: 1;">
            <div style="font-size: 20px; font-weight: 700; color: #dc2626;">${totalCritical}</div>
            <div style="color: #64748b; font-size: 11px; font-weight: 500; text-transform: uppercase; margin-top: 2px;">Critical Risk</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; flex: 1;">
            <div style="font-size: 20px; font-weight: 700; color: #ea580c;">${totalHigh}</div>
            <div style="color: #64748b; font-size: 11px; font-weight: 500; text-transform: uppercase; margin-top: 2px;">High Risk</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; flex: 1;">
            <div style="font-size: 20px; font-weight: 700; color: #2563eb;">${totalMedium}</div>
            <div style="color: #64748b; font-size: 11px; font-weight: 500; text-transform: uppercase; margin-top: 2px;">Medium Risk</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; flex: 1;">
            <div style="font-size: 20px; font-weight: 700; color: #16a34a;">${totalLow}</div>
            <div style="color: #64748b; font-size: 11px; font-weight: 500; text-transform: uppercase; margin-top: 2px;">Low Risk</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 10px; text-align: left; font-weight: 600;">ID</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Name</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Age</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Country</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Tenure</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Risk Level</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Probability</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Main Factor</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Status</th>
             </tr>
          </thead>
          <tbody>
            ${filteredCustomers.map(c => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; color: #64748b;">${c.id}</td>
                <td style="padding: 8px; font-weight: 500;">${c.name}</td>
                <td style="padding: 8px;">${c.age}</td>
                <td style="padding: 8px;">${c.country}</td>
                <td style="padding: 8px;">${c.tenure}m</td>
                <td style="padding: 8px; font-weight: 600; color: ${c.riskLevel === 'Critical' ? '#dc2626' : c.riskLevel === 'High' ? '#ea580c' : c.riskLevel === 'Medium' ? '#2563eb' : '#16a34a'};">
                  ${c.riskLevel}
                </td>
                <td style="padding: 8px; font-weight: 600;">${c.probability}%</td>
                <td style="padding: 8px; color: #475569;">${c.factor}</td>
                <td style="padding: 8px; font-weight: 500; color: ${c.isChurned ? '#dc2626' : '#16a34a'};">
                  ${c.isChurned ? "Churned" : "Active"}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    html2pdf().set({
      margin: 0.4,
      filename: `customer_analytics_${new Date().toISOString().split('T')[0]}.pdf`,
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).from(element).save();
  };

  if (loading) {
    return (
      <div>
        <SectionTitle isMobile={isMobile} themeColors={themeColors}>{t('customer.management')}</SectionTitle>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ textAlign: "center", padding: 40, color: themeColors.textSecondary }}>Loading analytical engine...</div>
        </GlassCard>
      </div>
    );
  }

  const tableHeaderBg = isLightMode ? "#f1f5f9" : "rgba(30, 41, 59, 0.5)";
  const tableHeaderTextColor = isLightMode ? "#334155" : "#94a3b8";
  const subInfoColor = isLightMode ? "#0f172a" : themeColors.textSecondary;

  return (
    <div>
      <style>{`
        @keyframes cleanFadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .dash-enter-clean { animation: cleanFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .clean-row { transition: background-color 0.15s ease, transform 0.15s ease; }
        .clean-row:hover {
          background-color: ${isLightMode ? "#f8fafc" : "rgba(51, 65, 85, 0.3)"} !important;
          transform: translateX(2px);
        }

        .clean-select {
          appearance: none;
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .clean-select:hover {
          border-color: ${isLightMode ? "#cbd5e1" : "#475569"} !important;
        }
        .clean-select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .btn-clean { transition: background-color 0.15s ease, border-color 0.15s ease; }
        .btn-clean:hover {
          background-color: ${isLightMode ? "#f8fafc" : "rgba(255,255,255,0.03)"} !important;
          border-color: ${isLightMode ? "#cbd5e1" : "#475569"} !important;
        }
      `}</style>

      {/* SUB-HEADER UTAMA DENGAN WARNA ADAPTIF KONTRAST TINGGI */}
      <SectionTitle
        isMobile={isMobile}
        themeColors={themeColors}
        sub={
          <span style={{ color: subInfoColor, fontWeight: 500, fontSize: 14 }}>
            {filteredCustomers.length} {t('customers.found')} ({customers.filter(c => c.isChurned).length} {t('churned.status')})
          </span>
        }
      >
        {t('customer.management')}
      </SectionTitle>

      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>

          {/* SEARCH BAR */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder={t('search.placeholder')} style={{ width: "100%", padding: "9px 12px 9px 36px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.text, fontSize: 13, outline: "none" }} />
          </div>

          {/* FILTER TINGKAT RISIKO */}
          <div style={{ position: "relative", minWidth: isMobile ? "100%" : "160px" }}>
            <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: filterRisk !== "All" ? "#3b82f6" : themeColors.textMuted, zIndex: 2, pointerEvents: "none" }} />
            <select
              value={filterRisk}
              onChange={e => { setFilterRisk(e.target.value); setCurrentPage(1); }}
              className="clean-select"
              style={{
                width: "100%",
                padding: "9px 30px 9px 34px",
                background: themeColors.inputBg,
                border: `1px solid ${themeColors.inputBorder}`,
                borderRadius: 8,
                color: themeColors.text,
                fontSize: 13,
                fontWeight: 500,
                outline: "none"
              }}
            >
              <option value="All" style={{ background: themeColors.bodyBg, color: themeColors.text }}>Tingkat Risiko</option>
              <option value="Critical" style={{ background: themeColors.bodyBg, color: riskColors.Critical }}>Critical</option>
              <option value="High" style={{ background: themeColors.bodyBg, color: riskColors.High }}>High</option>
              <option value="Medium" style={{ background: themeColors.bodyBg, color: riskColors.Medium }}>Medium</option>
              <option value="Low" style={{ background: themeColors.bodyBg, color: riskColors.Low }}>Low</option>
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted, pointerEvents: "none", fontSize: 9 }}>▼</span>
          </div>

          {/* FILTER STATUS */}
          <div style={{ position: "relative", minWidth: isMobile ? "100%" : "140px" }}>
            <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: filterStatus !== "All" ? "#3b82f6" : themeColors.textMuted, zIndex: 2, pointerEvents: "none" }} />
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="clean-select"
              style={{
                width: "100%",
                padding: "9px 30px 9px 34px",
                background: themeColors.inputBg,
                border: `1px solid ${themeColors.inputBorder}`,
                borderRadius: 8,
                color: themeColors.text,
                fontSize: 13,
                fontWeight: 500,
                outline: "none"
              }}
            >
              <option value="All" style={{ background: themeColors.bodyBg, color: themeColors.text }}>Status Churned</option>
              <option value="Active" style={{ background: themeColors.bodyBg, color: isLightMode ? "#16a34a" : "#22c55e" }}>Active</option>
              <option value="Churned" style={{ background: themeColors.bodyBg, color: isLightMode ? "#dc2626" : "#ef4444" }}>Churned</option>
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted, pointerEvents: "none", fontSize: 9 }}>▼</span>
          </div>

          <button onClick={handleExportCSV} className="btn-clean" style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><Download size={14} /> CSV</button>
          <button onClick={handleExportPDF} className="btn-clean" style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><Download size={14} /> PDF</button>
        </div>

        {/* DATA TABLE */}
        <div style={{ overflowX: "auto", border: `1px solid ${themeColors.sidebarBorder}`, borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13 }}>
            <thead>
              <tr style={{ backgroundColor: tableHeaderBg, borderBottom: `1px solid ${themeColors.sidebarBorder}` }}>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('customer.id.table')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('name')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('age.table')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('country')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('tenure.table')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('risk.level')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('probability.table')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('main.factor')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('recommendation')}</th>
                <th style={{ padding: "12px 14px", color: tableHeaderTextColor, textAlign: "left", fontWeight: 600 }}>{t('status')}</th>
              </tr>
            </thead>
            <tbody key={currentPage} className="dash-enter-clean">
              {paginatedCustomers.map((c, i) => (
                <tr key={c.id} className="clean-row" style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}`, background: i % 2 === 0 ? "transparent" : (isLightMode ? "#f8fafc" : "rgba(255,255,255,0.01)") }}>
                  <td style={{ padding: "12px 14px", color: themeColors.textMuted, fontFamily: "monospace" }}>{c.id}</td>
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
                      <span style={{ color: themeColors.text, fontWeight: 500, minWidth: 32, fontSize: 12 }}>{c.probability}%</span>
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

        {/* PAGINATION PANEL */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
          </span>
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 4 }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} style={{ padding: 6, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 6, color: currentPage === 1 ? themeColors.textMuted : themeColors.text, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}><ChevronLeft size={16} /></button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ padding: "6px 12px", background: currentPage === p ? "#3b82f6" : themeColors.inputBg, border: `1px solid ${currentPage === p ? "#3b82f6" : themeColors.inputBorder}`, borderRadius: 6, color: currentPage === p ? "#fff" : themeColors.text, fontWeight: 500, cursor: "pointer", fontSize: 13 }}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} style={{ padding: 6, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 6, color: currentPage === totalPages ? themeColors.textMuted : themeColors.text, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
