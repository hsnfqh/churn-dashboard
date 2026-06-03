import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";

export default function CustomerPage({ customers, search, setSearch, filterRisk, setFilterRisk, currentPage, setCurrentPage, totalPages, total, isMobile, themeColors }) {
  const { t } = useLanguage();
  const riskColors = { Critical: "#ef4444", High: "#f59e0b", Medium: "#3b82f6", Low: "#10b981" };
  return (
    <div>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={`${total} ${t('customers.found')}`}>{t('customer.management')}</SectionTitle>
      <GlassCard isMobile={isMobile} themeColors={themeColors}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: themeColors.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search.placeholder')} style={{ width: "100%", padding: "9px 12px 9px 34px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map(r => (
              <button key={r} onClick={() => setFilterRisk(r)} style={{ padding: "8px 14px", background: filterRisk === r ? "rgba(37,99,235,0.3)" : themeColors.inputBg, border: `1px solid ${filterRisk === r ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: filterRisk === r ? "#93c5fd" : themeColors.textSecondary, fontSize: 13, cursor: "pointer" }}>{r}</button>
            ))}
          </div>
          <button style={{ padding: "8px 14px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('export')}</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 11 : 13 }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.4), rgba(37,99,235,0.2))" }}>
                {[t('customer.id.table'), t('name'), t('age'), t('tenure'), t('risk.level'), t('probability.table'), t('main.factor'), t('recommendation')].map(h => (
                  <th key={h} style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#93c5fd", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${themeColors.sidebarBorder}`, background: i % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd }}>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#60a5fa", fontFamily: "monospace", fontSize: isMobile ? 10 : 13 }}>{c.id}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.text, fontWeight: 500, fontSize: isMobile ? 11 : 13 }}>{c.name}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 11 : 13 }}>{c.age}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 11 : 13 }}>{c.tenure}m</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px" }}>
                    <span style={{ padding: "4px 10px", background: `${riskColors[c.riskLevel]}18`, border: `1px solid ${riskColors[c.riskLevel]}44`, borderRadius: 20, color: riskColors[c.riskLevel], fontSize: isMobile ? 9 : 11, fontWeight: 600 }}>{c.riskLevel}</span>
                  </td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: themeColors.inputBorder, borderRadius: 4, overflow: "hidden", minWidth: isMobile ? 40 : 60 }}>
                        <div style={{ height: "100%", width: `${c.probability}%`, background: c.probability >= 70 ? "#ef4444" : c.probability >= 40 ? "#f59e0b" : "#10b981", borderRadius: 4 }} />
                      </div>
                      <span style={{ color: themeColors.text, fontWeight: 600, minWidth: 36, fontSize: isMobile ? 10 : 13 }}>{c.probability}%</span>
                    </div>
                  </td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: themeColors.textSecondary, fontSize: isMobile ? 10 : 13 }}>{c.factor}</td>
                  <td style={{ padding: isMobile ? "8px 8px" : "12px 14px", color: "#60a5fa", fontSize: isMobile ? 10 : 12 }}>{c.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <span style={{ color: themeColors.textMuted, fontSize: 13 }}>{t('showing')} {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, total)} {t('of')} {total}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 32, height: 32, background: currentPage === p ? "rgba(37,99,235,0.4)" : themeColors.inputBg, border: `1px solid ${currentPage === p ? "rgba(59,130,246,0.5)" : themeColors.inputBorder}`, borderRadius: 8, color: currentPage === p ? "#93c5fd" : themeColors.textSecondary, cursor: "pointer", fontSize: 13, fontWeight: currentPage === p ? 600 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 8, color: themeColors.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}