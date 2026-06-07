import { useState } from "react";
import { Users, Activity, Star, Shield, RefreshCw, Cpu, CheckCircle } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../contexts/LanguageContext";

export default function PredictionPage({ formData, setFormData, onPredict, predicting, result, isMobile, themeColors }) {
  const { t, language } = useLanguage();
  const inputStyle = { width: "100%", padding: "10px 12px", background: themeColors.inputBg, border: `1px solid ${themeColors.inputBorder}`, borderRadius: 10, color: themeColors.text, fontSize: 14, outline: "none", boxSizing: "border-box" };
  const labelStyle = { color: themeColors.textSecondary, fontSize: 13, marginBottom: 6, display: "block" };
  const fieldGroup = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 };
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const riskColor = result?.level?.includes("HIGH") || result?.level?.includes("RISIKO TINGGI") ? "#ef4444" : result?.level?.includes("MEDIUM") || result?.level?.includes("RISIKO SEDANG") ? "#f59e0b" : "#10b981";
  const riskBg = result?.level?.includes("HIGH") || result?.level?.includes("RISIKO TINGGI") ? "rgba(239,68,68,0.1)" : result?.level?.includes("MEDIUM") || result?.level?.includes("RISIKO SEDANG") ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionTitle isMobile={isMobile} themeColors={themeColors} sub={t('prediction.subtitle')}>{t('prediction.title')}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: result && !isMobile ? "1fr 1fr" : "1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Users size={16} /> {t('customer.info')}</h3>
            <div style={fieldGroup}>
              {[["customerId", t('customer.id'), "text", "CST-1001"], ["age", t('age'), "number", "28"]].map(([key, label, type, ph]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input type={type} value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={inputStyle} /></div>
              ))}
              <div><label style={labelStyle}>{t('gender')}</label><select value={formData.gender} onChange={e => set("gender", e.target.value)} style={inputStyle}>{["Male", "Female", "Other"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('tenure')}</label><input type="number" value={formData.tenure} onChange={e => set("tenure", e.target.value)} placeholder="24" style={inputStyle} /></div>
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Activity size={16} /> {t('usage.behavior')}</h3>
            <div style={fieldGroup}>
              {[["monthlyUsage", t('monthly.usage'), "number", "45"], ["transactionFreq", t('transaction.freq'), "number", "12"], ["avgSpending", t('avg.spending'), "number", "250"]].map(([key, label, type, ph]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input type={type} value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={inputStyle} /></div>
              ))}
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Star size={16} /> {t('customer.satisfaction')}</h3>
            <div style={fieldGroup}>
              <div><label style={labelStyle}>{t('satisfaction.score')}</label><select value={formData.satisfactionScore} onChange={e => set("satisfactionScore", e.target.value)} style={inputStyle}><option value="" style={{ background: themeColors.cardBg }}>Select score</option>{[1,2,3,4,5].map(v => <option key={v} value={v} style={{ background: themeColors.cardBg }}>{v} - {["Very Low","Low","Neutral","High","Very High"][v-1]}</option>)}</select></div>
              <div><label style={labelStyle}>{t('complaints')}</label><input type="number" value={formData.complaints} onChange={e => set("complaints", e.target.value)} placeholder="0" style={inputStyle} /></div>
              <div><label style={labelStyle}>{t('service.rating')}</label><input type="number" min="1" max="5" value={formData.serviceRating} onChange={e => set("serviceRating", e.target.value)} placeholder="4" style={inputStyle} /></div>
            </div>
          </GlassCard>

          <GlassCard isMobile={isMobile} themeColors={themeColors}>
            <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Shield size={16} /> {t('payment.details')}</h3>
            <div style={fieldGroup}>
              <div><label style={labelStyle}>{t('payment.method')}</label><select value={formData.paymentMethod} onChange={e => set("paymentMethod", e.target.value)} style={inputStyle}>{["Credit Card","Debit Card","Bank Transfer","Digital Wallet"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('late.payment')}</label><select value={formData.latePayment} onChange={e => set("latePayment", e.target.value)} style={inputStyle}>{["No","Yes","Sometimes"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
              <div><label style={labelStyle}>{t('subscription.type')}</label><select value={formData.subscriptionType} onChange={e => set("subscriptionType", e.target.value)} style={inputStyle}>{["Basic","Standard","Premium","Enterprise"].map(o => <option key={o} style={{ background: themeColors.cardBg }}>{o}</option>)}</select></div>
            </div>
          </GlassCard>

          <button onClick={onPredict} disabled={predicting} style={{ padding: "14px 28px", background: predicting ? "rgba(37,99,235,0.5)" : "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, cursor: predicting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: predicting ? "none" : "0 6px 24px rgba(37,99,235,0.4)" }}>
            {predicting ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> {t('analyzing')}</> : <><Cpu size={18} /> {t('predict.button')}</>}
          </button>
        </div>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard isMobile={isMobile} themeColors={themeColors} style={{ border: `1px solid ${riskColor}33` }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: themeColors.textMuted, marginBottom: 16 }}>{t('prediction.result')}</div>
                <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
                  <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 0 }}>
                    <circle cx="80" cy="80" r="68" fill="none" stroke={themeColors.inputBorder} strokeWidth="12" />
                    <circle cx="80" cy="80" r="68" fill="none" stroke={riskColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 68 * result.probability / 100} ${2 * Math.PI * 68}`} strokeDashoffset={2 * Math.PI * 68 * 0.25} style={{ transition: "stroke-dasharray 1.5s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: riskColor }}>{result.probability}%</div>
                    <div style={{ fontSize: 11, color: themeColors.textMuted }}>{t('probability')}</div>
                  </div>
                </div>
                <div style={{ display: "inline-block", padding: "8px 20px", background: riskBg, border: `1px solid ${riskColor}44`, borderRadius: 100, color: riskColor, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{result.level}</div>
                <p style={{ color: themeColors.textSecondary, fontSize: 13, margin: 0 }}>{t('main.cause')}: <span style={{ color: themeColors.text, fontWeight: 600 }}>{result.cause}</span></p>
              </div>
            </GlassCard>

            <GlassCard isMobile={isMobile} themeColors={themeColors}>
              <h3 style={{ color: "#93c5fd", margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>{t('recommended.actions')}</h3>
              {[
                result.probability >= 70 ? (language === 'id' ? "Segera tugaskan manajer sukses pelanggan khusus" : "Immediately assign a dedicated customer success manager") : (language === 'id' ? "Jadwalkan panggilan check-in rutin" : "Schedule a regular check-in call"),
                result.probability >= 50 ? (language === 'id' ? "Tawarkan diskon atau upgrade yang dipersonalisasi" : "Offer a personalized discount or upgrade") : (language === 'id' ? "Kirim survei kepuasan" : "Send a satisfaction survey"),
                language === 'id' ? "Daftarkan program loyalitas" : "Enroll in loyalty rewards program",
                result.probability >= 70 ? (language === 'id' ? "Kirim ke tim spesialis retensi" : "Escalate to retention specialist team") : (language === 'id' ? "Berikan sumber daya edukasi" : "Provide educational resources"),
              ].map((action, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${themeColors.sidebarBorder}` : "none" }}>
                  <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{action}</span>
                </div>
              ))}
            </GlassCard>

            <GlassCard isMobile={isMobile} themeColors={themeColors}>
              <h3 style={{ color: "#93c5fd", margin: "0 0 14px", fontSize: 14, fontWeight: 600 }}>{t('risk.breakdown')}</h3>
              {[
                [t('satisfaction'), result.probability >= 70 ? 85 : 40, "#ef4444"],
                [t('price.sensitivity'), 65, "#f59e0b"],
                [t('usage.pattern'), result.probability >= 50 ? 70 : 30, "#3b82f6"],
                [t('loyalty.index'), 100 - result.probability, "#10b981"]
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: themeColors.textSecondary, fontSize: 13 }}>{label}</span>
                    <span style={{ color: themeColors.text, fontSize: 13, fontWeight: 600 }}>{val}%</span>
                  </div>
                  <div style={{ height: 6, background: themeColors.inputBorder, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 10, transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}