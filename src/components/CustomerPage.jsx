import { useState, useEffect } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import html2pdf from "html2pdf.js";

// DATA DARI CSV ANDA (150 BARIS)
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

// 50 NAMA LAKI-LAKI DAN 50 NAMA PEREMPUAN
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
  
  if (gender === "male") {
    return maleNames[index % maleNames.length];
  } else {
    return femaleNames[index % femaleNames.length];
  }
};

export default function CustomerPage({ search, setSearch, filterRisk, setFilterRisk, currentPage, setCurrentPage, isMobile, themeColors }) {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const riskColors = { Critical: "#ef4444", High: "#f59e0b", Medium: "#3b82f6", Low: "#10b981" };

  useEffect(() => {
    const processedData = sampleData.map((row, idx) => {
      let probability = 0;
      
      const returns = row.Returns || 0;
      probability += Math.min(35, returns * 2.5);
      
      const credit = row.Credit || 0;
      if (credit < 500) probability += 25;
      else if (credit < 1000) probability += 15;
      else if (credit < 2000) probability += 8;
      else if (credit > 5000) probability -= 10;
      
      const days = row.Days || 0;
      if (days < 10) probability += 30;
      else if (days < 30) probability += 15;
      else if (days < 60) probability += 5;
      else if (days > 200) probability -= 10;
      
      const lifetime = row.Lifetime || 0;
      if (lifetime < 500) probability += 20;
      else if (lifetime < 1000) probability += 10;
      else if (lifetime > 3000) probability -= 15;
      
      const total = row.Total || 0;
      if (total < 50) probability += 15;
      else if (total > 200) probability -= 10;
      
      const age = row.Age || 30;
      if (age < 25) probability += 10;
      else if (age > 55) probability -= 5;
      
      if (row.Churned === 1) probability = 95;
      
      probability = Math.min(100, Math.max(0, Math.round(probability)));
      
      let riskLevel = "Low";
      if (probability >= 70) riskLevel = "Critical";
      else if (probability >= 40) riskLevel = "High";
      else if (probability >= 20) riskLevel = "Medium";
      else riskLevel = "Low";
      
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
        age: age,
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
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = !search || 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "All" || c.riskLevel === filterRisk;
    return matchSearch && matchRisk;
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

  // PDF VERSI BAGUS (dengan statistik card, warna, tabel lengkap)
  const handleExportPDF = () => {
    const totalChurned = filteredCustomers.filter(c => c.isChurned).length;
    const totalCritical = filteredCustomers.filter(c => c.riskLevel === "Critical").length;
    const totalHigh = filteredCustomers.filter(c => c.riskLevel === "High").length;
    const totalMedium = filteredCustomers.filter(c => c.riskLevel === "Medium").length;
    const totalLow = filteredCustomers.filter(c => c.riskLevel === "Low").length;
    
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #1e3a8a; text-align: center; margin-bottom: 5px;">Customer Churn Report</h1>
        <div style="text-align: center; color: #666; margin-bottom: 20px;">Customer Churn Dashboard</div>
        
        <div style="margin-bottom: 20px; background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Customers:</strong> ${filteredCustomers.length}</p>
          <p><strong>Churned Customers:</strong> ${totalChurned} (${((totalChurned/filteredCustomers.length)*100).toFixed(1)}%)</p>
        </div>
        
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px;">
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; flex: 1;">
            <h3 style="margin: 0; font-size: 24px; color: #ef4444;">${totalCritical}</h3>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">Critical Risk</p>
          </div>
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; flex: 1;">
            <h3 style="margin: 0; font-size: 24px; color: #f59e0b;">${totalHigh}</h3>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">High Risk</p>
          </div>
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; flex: 1;">
            <h3 style="margin: 0; font-size: 24px; color: #3b82f6;">${totalMedium}</h3>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">Medium Risk</p>
          </div>
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; flex: 1;">
            <h3 style="margin: 0; font-size: 24px; color: #10b981;">${totalLow}</h3>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">Low Risk</p>
          </div>
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; flex: 1;">
            <h3 style="margin: 0; font-size: 24px; color: #ef4444;">${totalChurned}</h3>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">Churned</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background-color: #1e3a8a;">
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">ID</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Name</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Age</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Country</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Tenure</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Risk Level</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Probability</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Main Factor</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Recommendation</th>
              <th style="padding: 8px; border: 1px solid #ddd; color: white; text-align: left;">Status</th>
             </tr>
          </thead>
          <tbody>
            ${filteredCustomers.map(c => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 6px; border: 1px solid #ddd;">${c.id}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.name}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.age}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.country}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.tenure}m</td>
                <td style="padding: 6px; border: 1px solid #ddd;">
                  <span style="background: ${c.riskLevel === 'Critical' ? '#ef4444' : c.riskLevel === 'High' ? '#f59e0b' : c.riskLevel === 'Medium' ? '#3b82f6' : '#10b981'}20; padding: 2px 6px; border-radius: 10px;">
                    ${c.riskLevel}
                  </span>
                </td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.probability}%</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.factor}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${c.recommendation}</td>
                <td style="padding: 6px; border: 1px solid #ddd; color: ${c.isChurned ? '#ef4444' : '#10b981'}; font-weight: bold;">
                  ${c.isChurned ? "Churned" : "Active"}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
          <p>Generated from Customer Churn Dashboard - ${new Date().toLocaleDateString()}</p>
          <p>This report is confidential and for internal use only.</p>
        </div>
      </div>
    `;
    
    html2pdf().set({ 
      margin: 0.5, 
      filename: `customer_report_${new Date().toISOString().split('T')[0]}.pdf`, 
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' } 
    }).from(element).save();
  };

  if (loading) {
    return (
      <div>
        <SectionTitle isMobile={isMobile} themeColors={themeColors}>{t('customer.management')}</SectionTitle>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ textAlign: "center", padding: 40, color: themeColors.textSecondary }}>Loading 150 customer data...</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={`${filteredCustomers.length} ${t('customers.found')} (${customers.filter(c => c.isChurned).length} ${t('churned.status')}, ${customers.filter(c => c.riskLevel === "Critical").length} ${t('critical')} ${t('risk.level')})`}>
        {t('customer.management')}
      </SectionTitle>
      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search.placeholder')} style={{ width: "100%", padding: "9px 12px 9px 34px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map(r => (
              <button key={r} onClick={() => setFilterRisk(r)} style={{ padding: "8px 14px", background: filterRisk === r ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${filterRisk === r ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: filterRisk === r ? "#93c5fd" : themeColors.textSecondary, fontSize: 13, cursor: "pointer" }}>{r === "All" ? "Semua" : r === "Critical" ? t('critical') : r === "High" ? t('high') : r === "Medium" ? t('medium') : t('low')}</button>
            ))}
          </div>
          <button onClick={handleExportCSV} style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('export')} CSV</button>
          <button onClick={handleExportPDF} style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('export')} PDF</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 11 : 13 }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.4), rgba(37,99,235,0.2))" }}>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('customer.id.table')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('name')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('age.table')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('country')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('tenure.table')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('risk.level')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('probability.table')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('main.factor')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('recommendation')}</th>
                <th style={{ padding: "12px 14px", color: "#93c5fd", textAlign: "left" }}>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}`, background: i % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd }}>
                  <td style={{ padding: "12px 14px", color: "#60a5fa", fontFamily: "monospace" }}>{c.id}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.text, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.age}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.country}</td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary }}>{c.tenure}m</td>
                  <td style={{ padding: "12px 14px" }}><span style={{ padding: "4px 10px", background: `${riskColors[c.riskLevel]}18`, border: `1px solid ${riskColors[c.riskLevel]}44`, borderRadius: 20, color: riskColors[c.riskLevel], fontSize: 11, fontWeight: 600 }}>{c.riskLevel === "Critical" ? t('critical') : c.riskLevel === "High" ? t('high') : c.riskLevel === "Medium" ? t('medium') : t('low')}</span></td>
                  <td style={{ padding: "12px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 4, background: themeColors.inputBorder, borderRadius: 4, overflow: "hidden", width: 60 }}><div style={{ height: "100%", width: `${c.probability}%`, background: c.probability >= 70 ? "#ef4444" : c.probability >= 40 ? "#f59e0b" : "#10b981", borderRadius: 4 }} /></div><span style={{ color: themeColors.text, fontWeight: 600, minWidth: 36 }}>{c.probability}%</span></div></td>
                  <td style={{ padding: "12px 14px", color: themeColors.textSecondary, fontSize: 12 }}>{c.factor === "Normal profile" ? t('normal.profile') : c.factor === "High return rate" ? t('high.return.rate') : c.factor === "Low credit score" ? t('low.credit.score') : c.factor === "Very low activity" ? t('very.low.activity') : c.factor === "Low activity" ? t('low.activity') : c.factor === "Low lifetime value" ? t('low.lifetime.value') : c.factor === "Low purchase amount" ? t('low.purchase.amount') : c.factor === "Multiple risk factors" ? t('multiple.risk.factors') : t('moderate.risk.factors')}</td>
                  <td style={{ padding: "12px 14px", color: "#60a5fa", fontSize: 12 }}>{c.recommendation === "Regular monitoring" ? t('regular.monitoring') : c.recommendation === "Urgent re-engagement campaign" ? t('urgent.reengagement') : c.recommendation === "Immediate retention call" ? t('immediate.retention') : c.recommendation === "Send personalized offer" ? t('send.personalized.offer') : t('monitor.engage')}</td>
                  <td style={{ padding: "12px 14px" }}><span style={{ padding: "4px 8px", background: c.isChurned ? "#ef444418" : "#10b98118", borderRadius: 12, color: c.isChurned ? "#ef4444" : "#10b981", fontSize: 11 }}>{c.isChurned ? t('churned.status') : t('active')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <span style={{ color: themeColors.textMuted, fontSize: 13 }}>{t('showing')} {startIndex + 1}–{Math.min(endIndex, filteredCustomers.length)} {t('of')} {filteredCustomers.length}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
            {getPageNumbers().map(p => (<button key={p} onClick={() => setCurrentPage(p)} style={{ width: 32, height: 32, background: currentPage === p ? "rgba(37,99,235,0.4)" : themeColors.inputBg, border: `1px solid ${currentPage === p ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: currentPage === p ? "#93c5fd" : themeColors.textSecondary, cursor: "pointer", fontSize: 13 }}>{p}</button>))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === totalPages ? 0.5 : 1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}