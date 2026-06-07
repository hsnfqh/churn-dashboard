import { LayoutDashboard, BarChart2, Users, Cpu, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar({ active, onNavigate, isMobile }) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, themeColors } = useTheme();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t('nav.dashboard') },
    { id: "prediction", icon: Cpu, label: t('nav.prediction') },
    { id: "customers", icon: Users, label: t('nav.customers') },
    { id: "analytics", icon: BarChart2, label: t('nav.analytics') },
  ];

  const hoverBg = theme === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.08)";
  const activeBg = theme === "dark" ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.12)";
  const activeTextColor = theme === "dark" ? "#818cf8" : "#4f46e5";

  return (
    <>
      <style>{`
        .sidebar-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .sidebar-item:hover {
          background-color: ${hoverBg} !important;
          color: ${activeTextColor} !important;
          padding-left: 16px !important;
        }
        .sidebar-item:hover .sidebar-icon {
          transform: scale(1.1) rotate(2deg);
          color: #6366f1 !important;
        }
      `}</style>

      <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: isMobile ? 0 : 260,
        background: themeColors.sidebarBg,
        backdropFilter: "blur(25px)",
        borderRight: `1px solid ${themeColors.sidebarBorder}`,
        display: isMobile ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 50,
        height: "100vh",
      }}>
        
        {/* Header Bagian Atas Tanpa Tombol Toggle */}
        <div style={{ 
          padding: "18px 16px", 
          borderBottom: `1px solid ${themeColors.sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflow: "hidden",
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4f46e5, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
            <Cpu size={18} color="#fff" />
          </div>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 14.5 }}>{t('app.name')}</div>
            <div style={{ color: themeColors.textMuted, fontSize: 11 }}>{t('app.subtitle')}</div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {menuItems.map(item => {
            const isActive = active === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => onNavigate(item.id)} 
                className="sidebar-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  width: "100%",
                  background: isActive ? activeBg : "transparent",
                  color: isActive ? activeTextColor : themeColors.textSecondary,
                  borderLeft: `3px solid ${isActive ? "#6366f1" : "transparent"}`,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <item.icon 
                  size={18} 
                  className="sidebar-icon" 
                  style={{ 
                    transition: "transform 0.2s, color 0.2s",
                    color: isActive ? "#6366f1" : themeColors.textSecondary 
                  }} 
                />
                <span style={{ fontSize: 13.5 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bagian Bawah: Switcher Bahasa & Tema */}
        <div style={{ 
          padding: "16px 12px 24px", 
          borderTop: `1px solid ${themeColors.sidebarBorder}`,
        }}>
          <div style={{ display: "flex", gap: 6, flexDirection: "row", alignItems: "center" }}>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{
              flex: 1,
              height: 36,
              padding: "0 8px",
              borderRadius: 10,
              border: `1px solid ${themeColors.sidebarBorder}`,
              background: themeColors.inputBg,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: themeColors.textSecondary,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#6366f1"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = themeColors.sidebarBorder}
            >
              {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
              <span style={{ fontSize: 12, fontWeight: 500 }}>{theme === 'dark' ? t('light') : t('dark')}</span>
            </button>
            
            <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} style={{
              flex: 1,
              height: 36,
              padding: "0 8px",
              borderRadius: 10,
              border: `1px solid ${themeColors.sidebarBorder}`,
              background: themeColors.inputBg,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: themeColors.textSecondary,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#6366f1"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = themeColors.sidebarBorder}
            >
              <Globe size={16} color={theme === "dark" ? "#10b981" : "#059669"} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{language === 'id' ? 'EN' : 'ID'}</span>
            </button>
          </div>
        </div>

      </div>
      
      {/* Spacer penyeimbang layout utama */}
      {!isMobile && (
        <div style={{
          width: 260,
          minWidth: 260,
          flexShrink: 0,
        }} />
      )}
    </>
  );
}