import { LayoutDashboard, BarChart2, Users, Cpu, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar({ open, active, onNavigate, isMobile }) {
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
      left: 0,
      top: 0,
      bottom: 0,
      width: open ? 260 : (isMobile ? 0 : 70),
      minWidth: open ? 260 : (isMobile ? 0 : 70),
      background: themeColors.sidebarBg,
      backdropFilter: "blur(20px)",
      borderRight: `1px solid ${themeColors.sidebarBorder}`,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      zIndex: 50,
      flexShrink: 0,
      height: "100vh",
    }}>
      <div style={{ 
        padding: "20px 20px 16px", 
        borderBottom: `1px solid ${themeColors.sidebarBorder}`,
        opacity: open ? 1 : 0,
        transition: "opacity 0.2s ease 0.1s",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Cpu size={18} color="#fff" />
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>{t('app.name')}</div>
            <div style={{ color: themeColors.textMuted, fontSize: 11, whiteSpace: "nowrap" }}>{t('app.subtitle')}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            gap: 12,
            padding: open ? "10px 12px" : "10px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            whiteSpace: "nowrap",
            width: "100%",
            background: active === item.id ? "linear-gradient(135deg, rgba(37,99,235,0.4), rgba(59,130,246,0.2))" : "transparent",
            color: active === item.id ? "#93c5fd" : themeColors.textSecondary,
            borderLeft: active === item.id ? "2px solid #3b82f6" : "2px solid transparent",
            transition: "all 0.2s ease",
          }}>
            <item.icon size={18} />
            {open && (
              <span style={{ 
                fontSize: 14, 
                fontWeight: active === item.id ? 600 : 400,
                opacity: open ? 1 : 0,
                transition: "opacity 0.2s ease 0.1s",
              }}>{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div style={{ 
        padding: "12px", 
        borderTop: `1px solid ${themeColors.sidebarBorder}`,
        opacity: open ? 1 : 0,
        transition: "opacity 0.2s ease 0.1s",
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: open ? "stretch" : "center" }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{
            flex: open ? 1 : "none",
            width: open ? "auto" : 32,
            padding: open ? "8px" : "6px",
            borderRadius: 8,
            border: `1px solid ${themeColors.inputBorder}`,
            background: themeColors.inputBg,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: open ? 6 : 0,
            color: themeColors.text,
          }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {open && <span style={{ fontSize: 12 }}>{theme === 'dark' ? t('light') : t('dark')}</span>}
          </button>
          <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} style={{
            flex: open ? 1 : "none",
            width: open ? "auto" : 32,
            padding: open ? "8px" : "6px",
            borderRadius: 8,
            border: `1px solid ${themeColors.inputBorder}`,
            background: themeColors.inputBg,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: open ? 6 : 0,
            color: themeColors.text,
          }}>
            <Globe size={16} />
            {open && <span style={{ fontSize: 12 }}>{language === 'id' ? 'EN' : 'ID'}</span>}
          </button>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: open ? "flex-start" : "center",
          gap: 10, 
          padding: open ? "8px 12px" : "8px",
          background: themeColors.badgeBg, 
          borderRadius: 10,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
          {open && (
            <div style={{ overflow: "hidden", transition: "opacity 0.2s ease 0.1s" }}>
              <div style={{ color: themeColors.text, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{t('admin')}</div>
              <div style={{ color: themeColors.textMuted, fontSize: 11, whiteSpace: "nowrap" }}>admin@churnai.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}