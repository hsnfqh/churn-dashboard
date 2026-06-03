import { Menu, Search, Settings, Bell, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function TopBar({ onMenuToggle, isMobile, onSettingsClick, themeColors }) {
  const { t } = useLanguage();
  return (
    <div style={{ 
      height: 64, 
      background: themeColors.cardBg, 
      backdropFilter: "blur(20px)", 
      borderBottom: `1px solid ${themeColors.cardBorder}`, 
      display: "flex", 
      alignItems: "center", 
      padding: isMobile ? "0 16px" : "0 24px", 
      gap: 16, 
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <button 
        onClick={onMenuToggle} 
        style={{ 
          background: themeColors.inputBg,
          border: `1px solid ${themeColors.inputBorder}`,
          borderRadius: 10,
          color: themeColors.textSecondary, 
          cursor: "pointer", 
          padding: 8, 
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = themeColors.badgeBg}
        onMouseLeave={(e) => e.currentTarget.style.background = themeColors.inputBg}
      >
        <Menu size={20} />
      </button>
      <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 360, position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
        <input 
          placeholder={t('search.placeholder.top')} 
          style={{ 
            width: "100%", 
            padding: "8px 12px 8px 36px", 
            background: themeColors.inputBg, 
            border: `1px solid ${themeColors.inputBorder}`, 
            borderRadius: 10, 
            color: themeColors.text, 
            fontSize: 14, 
            outline: "none", 
            boxSizing: "border-box",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.currentTarget.style.borderColor = themeColors.inputBorder}
        />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <button 
          onClick={onSettingsClick} 
          style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: themeColors.inputBg, 
            border: `1px solid ${themeColors.inputBorder}`, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer", 
            color: themeColors.textSecondary,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = themeColors.badgeBg}
          onMouseLeave={(e) => e.currentTarget.style.background = themeColors.inputBg}
        >
          <Settings size={17} />
        </button>
        <button 
          style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: themeColors.inputBg, 
            border: `1px solid ${themeColors.inputBorder}`, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer", 
            color: themeColors.textSecondary, 
            position: "relative",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = themeColors.badgeBg}
          onMouseLeave={(e) => e.currentTarget.style.background = themeColors.inputBg}
        >
          <Bell size={17} />
          <span style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: `2px solid ${themeColors.cardBg}` }} />
        </button>
        {!isMobile && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            padding: "6px 12px", 
            background: themeColors.inputBg, 
            border: `1px solid ${themeColors.inputBorder}`, 
            borderRadius: 10, 
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = themeColors.badgeBg}
          onMouseLeave={(e) => e.currentTarget.style.background = themeColors.inputBg}
          >
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
            <span style={{ color: themeColors.text, fontSize: 13 }}>{t('admin')}</span>
            <ChevronDown size={14} color={themeColors.textMuted} />
          </div>
        )}
      </div>
    </div>
  );
}