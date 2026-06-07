import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Data terjemahan - LENGKAP BAHASA INDONESIA
const translations = {
  id: {
    // Sidebar
    'app.name': 'ChurnAI',
    'app.subtitle': 'Platform Analitik',
    'nav.dashboard': 'Beranda',
    'nav.prediction': 'Prediksi Churn',
    'nav.customers': 'Data Pelanggan',
    'nav.analytics': 'Analitik',
    
    // Dashboard
    'dashboard.title': 'Ringkasan Dashboard',
    'dashboard.subtitle': 'Gambaran metrik churn dan tren pelanggan',
    'stat.total.customers': 'Total Pelanggan',
    'stat.total.sub': 'Akun aktif',
    'stat.high.risk': 'Risiko Tinggi',
    'stat.high.sub': 'Perlu perhatian',
    'stat.loyal': 'Pelanggan Setia',
    'stat.loyal.sub': 'Diprediksi bertahan',
    'stat.churn.rate': 'Tingkat Churn',
    'stat.churn.sub': 'Prediksi model',
    'churn.trend': 'Tren Churn',
    'churn.trend.sub': 'Churn berdasarkan kuartal pendaftaran',
    'customer.distribution': 'Distribusi Pelanggan',
    'customer.distribution.sub': 'Rincian status',
    'churn.factor': 'Analisis Faktor Churn',
    'churn.factor.sub': 'Penyebab utama churn pelanggan',
    'loyal': 'Setia',
    'at.risk': 'Berisiko',
    'churned': 'Berhenti',
    
    // Prediction Page
    'prediction.title': 'Prediksi Churn',
    'prediction.subtitle': 'Masukkan data pelanggan untuk memprediksi kemungkinan churn',
    'customer.info': 'Informasi Pelanggan',
    'usage.behavior': 'Perilaku Penggunaan',
    'customer.satisfaction': 'Kepuasan Pelanggan',
    'payment.details': 'Detail Pembayaran',
    'customer.id': 'ID Pelanggan',
    'age': 'Usia',
    'gender': 'Jenis Kelamin',
    'tenure': 'Masa Langganan',
    'monthly.usage': 'Penggunaan Bulanan',
    'transaction.freq': 'Frekuensi Transaksi',
    'avg.spending': 'Rata-rata Pengeluaran',
    'satisfaction.score': 'Skor Kepuasan',
    'complaints': 'Jumlah Keluhan',
    'service.rating': 'Rating Layanan',
    'payment.method': 'Metode Pembayaran',
    'late.payment': 'Pembayaran Terlambat',
    'subscription.type': 'Jenis Langganan',
    'predict.button': 'Prediksi Churn',
    'analyzing': 'Menganalisis...',
    'prediction.result': 'HASIL PREDIKSI',
    'probability': 'probabilitas',
    'high.risk': 'RISIKO TINGGI',
    'medium.risk': 'RISIKO SEDANG',
    'low.risk': 'RISIKO RENDAH',
    'main.cause': 'Penyebab Utama',
    'recommended.actions': 'Rekomendasi Tindakan',
    'risk.breakdown': 'Rincian Risiko',
    'satisfaction': 'Kepuasan',
    'price.sensitivity': 'Sensitivitas Harga',
    'usage.pattern': 'Pola Penggunaan',
    'loyalty.index': 'Indeks Loyalitas',
    
    // Customer Page
    'customer.management': 'Data Pelanggan',
    'customers.found': 'pelanggan ditemukan',
    'search.placeholder': 'Cari berdasarkan ID atau nama...',
    'export': 'Ekspor',
    'showing': 'Menampilkan',
    'of': 'dari',
    'customer.id.table': 'ID',
    'name': 'Nama',
    'age.table': 'Usia',
    'country': 'Negara',
    'tenure.table': 'Masa',
    'risk.level': 'Tingkat Risiko',
    'probability.table': 'Probabilitas',
    'main.factor': 'Faktor Utama',
    'recommendation': 'Rekomendasi',
    'status': 'Status',
    'active': 'Aktif',
    'churned.status': 'Berhenti',
    
    // Risk Levels
    'critical': 'Kritis',
    'high': 'Tinggi',
    'medium': 'Sedang',
    'low': 'Rendah',
    
    // Factors
    'normal.profile': 'Profil normal',
    'high.return.rate': 'Tingkat pengembalian tinggi',
    'low.credit.score': 'Skor kredit rendah',
    'very.low.activity': 'Aktivitas sangat rendah',
    'low.activity': 'Aktivitas rendah',
    'low.lifetime.value': 'Nilai seumur hidup rendah',
    'low.purchase.amount': 'Jumlah pembelian rendah',
    'multiple.risk.factors': 'Beberapa faktor risiko',
    'moderate.risk.factors': 'Faktor risiko sedang',
    
    // Recommendations
    'regular.monitoring': 'Pemantauan rutin',
    'urgent.reengagement': 'Kampanye re-engagement mendesak',
    'immediate.retention': 'Panggilan retensi segera',
    'send.personalized.offer': 'Kirim penawaran personal',
    'monitor.engage': 'Pantau dan libatkan secara rutin',
    
    // Analytics Page
    'analytics.title': 'Wawasan Analitik',
    'analytics.subtitle': 'Pola churn dan perilaku pelanggan',
    'feature.importance': 'Pentingnya Fitur',
    'feature.sub': 'Prediktor utama churn',
    'customer.segments': 'Segmen Pelanggan',
    'segments.sub': 'CLV vs risiko churn',
    'customers.count': 'pelanggan',
    'risk.distribution': 'Distribusi Risiko',
    'risk.distribution.sub': 'Pelanggan berisiko tinggi, sedang, rendah per bulan',
    
    // Topbar
    'search.placeholder.top': 'Cari pelanggan, prediksi...',
    'admin': 'Admin',
    'settings': 'Pengaturan',
    'logout': 'Keluar',
    
    // Settings Page
    'settings.title': 'Pengaturan',
    'settings.subtitle': 'Konfigurasi preferensi platform ChurnAI Anda',
    'model.config': 'Konfigurasi Model',
    'prediction.model': 'Model Prediksi',
    'high.risk.threshold': 'Ambang Batas Risiko Tinggi',
    'notifications': 'Notifikasi',
    'email.alerts': 'Peringatan Email',
    'email.desc': 'Dapatkan notifikasi email untuk pelanggan berisiko tinggi',
    'sms.alerts': 'Peringatan SMS',
    'sms.desc': 'Terima pesan teks untuk kejadian churn kritis',
    'weekly.report': 'Laporan Mingguan',
    'weekly.desc': 'Laporan analisis churn mingguan otomatis',
    'critical.alerts': 'Peringatan Kritis',
    'critical.desc': 'Peringatan instan untuk pelanggan di atas ambang batas risiko',
    'data.export': 'Ekspor Data',
    'theme': 'Tema',
    'language': 'Bahasa',
    'light': 'Terang',
    'dark': 'Gelap',
    'indonesian': 'Indonesia',
    'english': 'Inggris',
    'save': 'Simpan',
    'cancel': 'Batal',
  },
  en: {
    // Sidebar
    'app.name': 'ChurnAI',
    'app.subtitle': 'Analytics Platform',
    'nav.dashboard': 'Dashboard',
    'nav.prediction': 'Churn Prediction',
    'nav.customers': 'Customer Data',
    'nav.analytics': 'Analytics',
    
    // Dashboard
    'dashboard.title': 'Dashboard Overview',
    'dashboard.subtitle': 'Overview of customer churn metrics and trends',
    'stat.total.customers': 'Total Customers',
    'stat.total.sub': 'Active accounts',
    'stat.high.risk': 'High Risk',
    'stat.high.sub': 'Needs attention',
    'stat.loyal': 'Loyal Customers',
    'stat.loyal.sub': 'Predicted to stay',
    'stat.churn.rate': 'Churn Rate',
    'stat.churn.sub': 'Model prediction',
    'churn.trend': 'Churn Trend',
    'churn.trend.sub': 'Churn rate per quarter',
    'customer.distribution': 'Customer Distribution',
    'customer.distribution.sub': 'Status breakdown',
    'churn.factor': 'Churn Factor Analysis',
    'churn.factor.sub': 'Primary causes of customer churn',
    'loyal': 'Loyal',
    'at.risk': 'At Risk',
    'churned': 'Churned',
    
    // Prediction Page
    'prediction.title': 'Churn Prediction',
    'prediction.subtitle': 'Enter customer data to predict churn probability',
    'customer.info': 'Customer Information',
    'usage.behavior': 'Usage Behavior',
    'customer.satisfaction': 'Customer Satisfaction',
    'payment.details': 'Payment Details',
    'customer.id': 'Customer ID',
    'age': 'Age',
    'gender': 'Gender',
    'tenure': 'Tenure',
    'monthly.usage': 'Monthly Usage',
    'transaction.freq': 'Transaction Frequency',
    'avg.spending': 'Avg Spending',
    'satisfaction.score': 'Satisfaction Score',
    'complaints': 'Number of Complaints',
    'service.rating': 'Service Rating',
    'payment.method': 'Payment Method',
    'late.payment': 'Late Payment',
    'subscription.type': 'Subscription Type',
    'predict.button': 'Predict Churn',
    'analyzing': 'Analyzing...',
    'prediction.result': 'PREDICTION RESULT',
    'probability': 'probability',
    'high.risk': 'HIGH RISK',
    'medium.risk': 'MEDIUM RISK',
    'low.risk': 'LOW RISK',
    'main.cause': 'Main Cause',
    'recommended.actions': 'Recommended Actions',
    'risk.breakdown': 'Risk Breakdown',
    'satisfaction': 'Satisfaction',
    'price.sensitivity': 'Price Sensitivity',
    'usage.pattern': 'Usage Pattern',
    'loyalty.index': 'Loyalty Index',
    
    // Customer Page
    'customer.management': 'Customer Management',
    'customers.found': 'customers found',
    'search.placeholder': 'Search by ID or name...',
    'export': 'Export',
    'showing': 'Showing',
    'of': 'of',
    'customer.id.table': 'ID',
    'name': 'Name',
    'age.table': 'Age',
    'country': 'Country',
    'tenure.table': 'Tenure',
    'risk.level': 'Risk Level',
    'probability.table': 'Probability',
    'main.factor': 'Main Factor',
    'recommendation': 'Recommendation',
    'status': 'Status',
    'active': 'Active',
    'churned.status': 'Churned',
    
    // Risk Levels
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    
    // Factors
    'normal.profile': 'Normal profile',
    'high.return.rate': 'High return rate',
    'low.credit.score': 'Low credit score',
    'very.low.activity': 'Very low activity',
    'low.activity': 'Low activity',
    'low.lifetime.value': 'Low lifetime value',
    'low.purchase.amount': 'Low purchase amount',
    'multiple.risk.factors': 'Multiple risk factors',
    'moderate.risk.factors': 'Moderate risk factors',
    
    // Recommendations
    'regular.monitoring': 'Regular monitoring',
    'urgent.reengagement': 'Urgent re-engagement campaign',
    'immediate.retention': 'Immediate retention call',
    'send.personalized.offer': 'Send personalized offer',
    'monitor.engage': 'Monitor & engage regularly',
    
    // Analytics Page
    'analytics.title': 'Analytics Insight',
    'analytics.subtitle': 'Deep dive into churn patterns and customer behavior',
    'feature.importance': 'Feature Importance',
    'feature.sub': 'Key predictors of churn',
    'customer.segments': 'Customer Segments',
    'segments.sub': 'CLV vs churn risk',
    'customers.count': 'customers',
    'risk.distribution': 'Risk Distribution Over Time',
    'risk.distribution.sub': 'High, medium, and low risk customers monthly',
    
    // Topbar
    'search.placeholder.top': 'Search customers, predictions...',
    'admin': 'Admin',
    'settings': 'Settings',
    'logout': 'Logout',
    
    // Settings Page
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure your ChurnAI platform preferences',
    'model.config': 'Model Configuration',
    'prediction.model': 'Prediction Model',
    'high.risk.threshold': 'High Risk Threshold',
    'notifications': 'Notifications',
    'email.alerts': 'Email Alerts',
    'email.desc': 'Get notified via email for high-risk customers',
    'sms.alerts': 'SMS Alerts',
    'sms.desc': 'Receive text messages for critical churn events',
    'weekly.report': 'Weekly Report',
    'weekly.desc': 'Automated weekly churn analysis report',
    'critical.alerts': 'Critical Alerts',
    'critical.desc': 'Instant alerts for customers above risk threshold',
    'data.export': 'Data Export',
    'theme': 'Theme',
    'language': 'Language',
    'light': 'Light',
    'dark': 'Dark',
    'indonesian': 'Indonesian',
    'english': 'English',
    'save': 'Save',
    'cancel': 'Cancel',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}