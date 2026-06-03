import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsPanel({ onClose, themeColors }) {
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