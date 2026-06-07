export default function CustomTooltip({ active, payload, label, themeColors }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
      <p style={{ color: themeColors.textSecondary, margin: "0 0 6px", fontWeight: 500 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#60a5fa", margin: "2px 0", fontWeight: 600 }}>{p.name}: {p.value}{typeof p.value === "number" && p.value < 100 && p.name?.includes("%") ? "%" : ""}</p>
      ))}
    </div>
  );
}