import { AlertTriangle, TrendingDown, UserCheck, Zap, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import CustomTooltip from "./CustomTooltip";
import { featureImportanceData, segmentData, churnTrendData, CHART_COLORS } from "../data/mockData";

export default function AnalyticsPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  const insights = [
    { icon: AlertTriangle, color: "#ef4444", text: "Customers with satisfaction score ≤2 have 3.4× higher churn probability." },
    { icon: TrendingDown, color: "#f59e0b", text: "Late payment customers churn at 42% vs 8% for on-time payers." },
    { icon: UserCheck, color: "#10b981", text: "Customers with tenure >24 months show 78% lower churn rate." },
    { icon: Zap, color: "#3b82f6", text: "High-frequency users (>30 sessions/month) are 5× more likely to remain loyal." },
  ];

  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('analytics.subtitle')}>{t('analytics.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('feature.importance')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('feature.sub')}</p>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
              <XAxis type="number" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke={themeColors.chartAxis} fontSize={11} tickLine={false} width={isMobile ? 90 : 110} />
              <Tooltip content={<CustomTooltip themeColors={themeColors} />} formatter={v => [`${(v * 100).toFixed(0)}%`]} />
              <Bar dataKey="importance" name="Importance" radius={[0, 6, 6, 0]}>
                {featureImportanceData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i] || "#2563eb"} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('customer.segments')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('segments.sub')}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {segmentData.map((s, i) => (
              <div key={i} style={{ background: themeColors.badgeBg, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${CHART_COLORS[i]}22`, border: `1px solid ${CHART_COLORS[i]}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Layers size={18} color={CHART_COLORS[i]} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 14 }}>{s.segment}</span>
                    <span style={{ color: s.churnRate > 30 ? "#ef4444" : s.churnRate > 10 ? "#f59e0b" : "#10b981", fontSize: 13, fontWeight: 700 }}>{s.churnRate}% churn</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ color: themeColors.textMuted, fontSize: 12 }}>{s.customers.toLocaleString()} {t('customers.count')}</span>
                    <span style={{ color: themeColors.textMuted, fontSize: 12 }}>CLV: ${s.clv}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ marginBottom: 16 }}>
        <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('risk.distribution')}</h3>
        <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('risk.distribution.sub')}</p>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
          <BarChart data={churnTrendData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
            <XAxis dataKey="month" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
            <Bar dataKey="churn" name="High Risk %" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="newCustomers" name="New Customers" stackId="b" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ background: `${ins.color}0d`, border: `1px solid ${ins.color}33`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <ins.icon size={18} color={ins.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: themeColors.textSecondary, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}