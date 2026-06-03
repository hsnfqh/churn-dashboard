export default function SectionTitle({ children, sub, isMobile, themeColors }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ color: themeColors.text, fontSize: isMobile ? 16 : 18, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>{children}</h2>
      {sub && <p style={{ color: themeColors.textMuted, fontSize: 12, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}