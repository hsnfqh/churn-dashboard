import { useState, useRef, useEffect } from "react";
import { Search, Settings, Bell, ChevronDown, User, LogOut, Shield, Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function TopBar({ isMobile, onSettingsClick, themeColors, theme }) {
  const { t } = useLanguage();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "Akurasi Model Meningkat", desc: "Retraining XGBoost selesai, akurasi naik ke 91%", time: "5 mnt lalu" },
    { id: 2, title: "Peringatan Churn Tinggi", desc: "3 akun enterprise terdeteksi risiko tinggi", time: "1 jam lalu" }
  ];

  // MENANGGULANGI TRANSPARANSI: Paksa warna latar & teks menjadi padat (Solid) berdasarkan tema aktif
  const isDark = theme === "dark";
  const dropdownBg = isDark ? "#1e1e2f" : "#ffffff"; 
  const textPrimary = isDark ? "#f3f4f6" : "#1f2937";
  const textSecondary = isDark ? "#9ca3af" : "#4b5563"; // Dipergelap untuk light mode agar kontras tinggi
  const textMuted = isDark ? "#6b7280" : "#9ca3af";
  const itemHoverBg = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
  const dropdownBorder = isDark ? "#2d2d44" : "#e5e7eb";

  return (
    <div style={{ 
      height: 64, 
      background: themeColors.cardBg, 
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
      {/* Kolom Pencarian */}
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
          onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
          onBlur={(e) => e.currentTarget.style.borderColor = themeColors.inputBorder}
        />
      </div>

      {/* Bagian Menu Sisi Kanan */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", position: "relative" }}>
        
        {/* Tombol Pengaturan */}
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

        {/* Komponen Notifikasi Terintegrasi */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              background: showNotifications ? themeColors.badgeBg : themeColors.inputBg, 
              border: `1px solid ${showNotifications ? "#6366f1" : themeColors.inputBorder}`, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer", 
              color: showNotifications ? "#6366f1" : themeColors.textSecondary, 
              position: "relative",
              transition: "all 0.2s ease",
            }}
          >
            <Bell size={17} />
            <span style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: `2px solid ${themeColors.cardBg}` }} />
          </button>

          {/* Panel Isi Konten Dropdown Notifikasi (DIJAMIN SOLID 100%) */}
          {showNotifications && (
            <div style={{
              position: "absolute", right: 0, top: 46, width: 290,
              background: dropdownBg, 
              border: `1px solid ${dropdownBorder}`,
              borderRadius: 12, 
              boxShadow: isDark 
                ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(255, 255, 255, 0.05)" 
                : "0 10px 30px rgba(0, 0, 0, 0.12)",
              padding: "12px 0", 
              overflow: "hidden"
            }}>
              <div style={{ padding: "0 14px 10px", borderBottom: `1px solid ${dropdownBorder}`, fontSize: 13.5, fontWeight: 600, color: textPrimary }}>Notifikasi Terbaru</div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ padding: "12px 14px", borderBottom: `1px solid ${dropdownBorder}`, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = itemHoverBg} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: isDark ? "#818cf8" : "#4f46e5", fontSize: 12.5, fontWeight: 600 }}><CheckCircle2 size={13.5}/> {n.title}</div>
                    <div style={{ color: textSecondary, fontSize: 11.5, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
                    <div style={{ color: textMuted, fontSize: 10.5, marginTop: 5 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Komponen Menu Profil Terintegrasi */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              padding: isMobile ? "5px" : "6px 12px", 
              background: showProfileMenu ? themeColors.badgeBg : themeColors.inputBg, 
              border: `1px solid ${showProfileMenu ? "#6366f1" : themeColors.inputBorder}`, 
              borderRadius: 10, 
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
            {!isMobile && (
              <>
                <span style={{ color: themeColors.text, fontSize: 13, fontWeight: 500 }}>{t('admin')}</span>
                <ChevronDown size={14} color={themeColors.textMuted} style={{ transform: showProfileMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </>
            )}
          </div>

          {/* Panel Isi Konten Dropdown Profil (DIJAMIN SOLID 100%) */}
          {showProfileMenu && (
            <div style={{
              position: "absolute", right: 0, top: 46, width: 210,
              background: dropdownBg, 
              border: `1px solid ${dropdownBorder}`,
              borderRadius: 12, 
              boxShadow: isDark 
                ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(255, 255, 255, 0.05)" 
                : "0 10px 30px rgba(0, 0, 0, 0.12)",
              padding: "8px 0"
            }}>
              <div style={{ padding: "8px 14px 10px", borderBottom: `1px solid ${dropdownBorder}` }}>
                <div style={{ color: textPrimary, fontSize: 13.5, fontWeight: 600 }}>{t('admin')}</div>
                <div style={{ color: textMuted, fontSize: 11, display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}><Mail size={11}/> admin@churnai.com</div>
              </div>
              <div style={{ padding: "4px 0" }}>
                <button style={{ width: "100%", padding: "9px 14px", border: "none", background: "transparent", color: textSecondary, fontSize: 12.5, textAlign: "left", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = itemHoverBg} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <User size={14} /> Pengaturan Profil
                </button>
                <button style={{ width: "100%", padding: "9px 14px", border: "none", background: "transparent", color: "#ef4444", fontSize: 12.5, textAlign: "left", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", borderTop: `1px solid ${dropdownBorder}`, transition: "background 0.2s", marginTop: 4 }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <LogOut size={14} /> Keluar Aplikasi
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}