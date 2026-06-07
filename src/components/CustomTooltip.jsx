export default function CustomTooltip({ active, payload, label, themeColors }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{
      background: themeColors.bodyBg,
      border: `1px solid ${themeColors.sidebarBorder}`,
      borderRadius: 8,
      padding: "8px 12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontSize: 12
    }}>
      <p style={{ margin: 0, color: themeColors.text, fontWeight: 600 }}>{label}</p>
      {payload.map((item, idx) => (
        <p key={idx} style={{ margin: "4px 0 0", color: item.color || themeColors.textSecondary }}>
          {item.name}: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
          {item.name === 'Importance' && item.value < 1 ? ` (${(item.value * 100).toFixed(1)}%)` : ''}
          {item.name === 'churn' || item.name === 'predicted' ? '%' : ''}
        </p>
      ))}
    </div>
  );
}