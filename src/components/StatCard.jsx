import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon: Icon, title, value, sub, color, trend, trendUp, isMobile, themeColors }) {
  return (
    <div style={{ background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `${color}18` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={isMobile ? 16 : 20} color={color} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: trendUp ? "#10b981" : "#ef4444", background: trendUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "4px 8px", borderRadius: 20 }}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: themeColors.text, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: themeColors.textSecondary }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: themeColors.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}