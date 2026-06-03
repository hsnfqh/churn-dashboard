import { Users, AlertTriangle, UserCheck, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import StatCard from "./StatCard";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import CustomTooltip from "./CustomTooltip";
import { churnTrendData, churnFactorData, distributionData } from "../data/mockData";

export default function DashboardPage({ isMobile, themeColors }) {
  const { t } = useLanguage();
  
  const distData = [
    { name: t('loyal'), value: 72, color: "#2563eb" },
    { name: t('at.risk'), value: 18, color: "#60a5fa" },
    { name: t('churned'), value: 10, color: "#1d4ed8" },
  ];
  
  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('dashboard.subtitle')}>{t('dashboard.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={Users} title={t('stat.total.customers')} value="12,847" sub={t('stat.total.sub')} color="#3b82f6" trend="+4.2%" trendUp />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={AlertTriangle} title={t('stat.high.risk')} value="1,428" sub={t('stat.high.sub')} color="#f59e0b" trend="+8.1%" trendUp={false} />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={UserCheck} title={t('stat.loyal')} value="9,251" sub={t('stat.loyal.sub')} color="#10b981" trend="+2.3%" trendUp />
        <StatCard isMobile={isMobile} themeColors={themeColors} icon={TrendingDown} title={t('stat.churn.rate')} value="8.4%" sub={t('stat.churn.sub')} color="#ef4444" trend="-1.2%" trendUp />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ color: themeColors.text, margin: 0, fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.trend')}</h3>
              <p style={{ color: themeColors.textMuted, margin: "2px 0 0", fontSize: 11 }}>{t('churn.trend.sub')}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["1M", "3M", "1Y"].map(t => (
                <button key={t} style={{ padding: "4px 10px", background: t === "1Y" ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${t === "1Y" ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 6, color: t === "1Y" ? "#93c5fd" : themeColors.textSecondary, fontSize: 12, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <AreaChart data={churnTrendData}>
              <defs>
                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
              <XAxis dataKey="month" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
              <YAxis stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
              <Area type="monotone" dataKey="churn" stroke="#2563eb" fill="url(#churnGrad)" name={t('stat.churn.rate')} strokeWidth={2} />
              <Area type="monotone" dataKey="newCustomers" stroke="#60a5fa" fill="url(#churnGrad)" name={t('stat.total.customers')} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard isMobile={isMobile} themeColors={themeColors}>
          <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('customer.distribution')}</h3>
          <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('customer.distribution.sub')}</p>
          <ResponsiveContainer width="100%" height={isMobile ? 140 : 180}>
            <PieChart>
              <Pie data={distData} cx="50%" cy="50%" innerRadius={isMobile ? 30 : 50} outerRadius={isMobile ? 50 : 75} paddingAngle={4} dataKey="value">
                {distData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ background: themeColors.tooltipBg, border: `1px solid ${themeColors.tooltipBorder}`, borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {distData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{d.name}</span>
                </div>
                <span style={{ color: themeColors.text, fontWeight: 600, fontSize: 13 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <h3 style={{ color: themeColors.text, margin: "0 0 4px", fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{t('churn.factor')}</h3>
        <p style={{ color: themeColors.textMuted, margin: "0 0 16px", fontSize: 11 }}>{t('churn.factor.sub')}</p>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
          <BarChart data={churnFactorData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} horizontal={false} />
            <XAxis type="number" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} />
            <YAxis dataKey="factor" type="category" stroke={themeColors.chartAxis} fontSize={12} tickLine={false} width={isMobile ? 70 : 90} />
            <Tooltip content={<CustomTooltip themeColors={themeColors} />} />
            <Bar dataKey="value" name="Impact %" radius={[0, 6, 6, 0]}>
              {churnFactorData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}