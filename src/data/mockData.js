export const CHART_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#1e40af"];

export const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
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

export const churnTrendData = [
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

export const churnFactorData = [
  { factor: "Price", value: 34, color: "#2563eb" },
  { factor: "Service", value: 27, color: "#3b82f6" },
  { factor: "Usage Freq", value: 19, color: "#60a5fa" },
  { factor: "Satisfaction", value: 15, color: "#93c5fd" },
  { factor: "Other", value: 5, color: "#bfdbfe" },
];

export const distributionData = [
  { name: "Loyal", value: 72, color: "#2563eb" },
  { name: "At Risk", value: 18, color: "#60a5fa" },
  { name: "Churned", value: 10, color: "#1d4ed8" },
];

export const segmentData = [
  { segment: "Champions", customers: 2840, churnRate: 2.1, clv: 1200 },
  { segment: "Loyal", customers: 3120, churnRate: 5.4, clv: 890 },
  { segment: "At Risk", customers: 1580, churnRate: 34.2, clv: 450 },
  { segment: "Lost", customers: 720, churnRate: 78.9, clv: 120 },
];

export const featureImportanceData = [
  { feature: "Satisfaction Score", importance: 0.28 },
  { feature: "Monthly Usage", importance: 0.22 },
  { feature: "Tenure", importance: 0.18 },
  { feature: "Complaint Count", importance: 0.14 },
  { feature: "Late Payments", importance: 0.10 },
  { feature: "Spending", importance: 0.08 },
];