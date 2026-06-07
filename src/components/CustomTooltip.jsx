export default function CustomTooltip({ active, payload, label, themeColors }) {
  if (!active || !payload || !payload.length) return null;

  // Deteksi mode terang/gelap berdasarkan themeColors
  const isLightMode = themeColors.bodyBg === "#ffffff" || themeColors.bodyBg === "#f8fafc";

  // Warna background tooltip: putih solid untuk kedua mode
  const tooltipBg = "#ffffff";
  const tooltipText = isLightMode ? "#1e293b" : "#0f172a";
  const tooltipBorder = "#e2e8f0";

  return (
    <div style={{
      background: tooltipBg,
      border: `1px solid ${tooltipBorder}`,
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      fontSize: 12,
      minWidth: 160
    }}>
      <p style={{
        margin: 0,
        color: tooltipText,
        fontWeight: 700,
        fontSize: 13,
        borderBottom: `1px solid ${tooltipBorder}`,
        paddingBottom: 6,
        marginBottom: 6
      }}>
        {label}
      </p>
      {payload.map((item, idx) => (
        <p key={idx} style={{
          margin: "6px 0 0",
          color: item.color || tooltipText,
          fontWeight: item.color ? 600 : 400,
          display: "flex",
          justifyContent: "space-between",
          gap: 12
        }}>
          <span style={{ color: "#64748b" }}>{item.name}:</span>
          <span style={{ fontWeight: 600, color: tooltipText }}>
            {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
            {item.name === 'Importance' && item.value < 1 ? ` (${(item.value * 100).toFixed(1)}%)` : ''}
            {item.name === 'churn' || item.name === 'churnRate' || item.name === 'predicted' ? '%' : ''}
            {item.name === 'Tingkat Churn' ? '%' : ''}
          </span>
        </p>
      ))}
    </div>
  );
}