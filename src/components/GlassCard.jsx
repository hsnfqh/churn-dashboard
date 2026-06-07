export default function GlassCard({ children, style = {}, isMobile, themeColors }) {
  return (
    <div style={{ background: themeColors.cardBg, backdropFilter: "blur(20px)", border: `1px solid ${themeColors.cardBorder}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", ...style }}>
      {children}
    </div>
  );
}