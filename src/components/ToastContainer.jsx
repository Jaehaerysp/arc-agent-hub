import React from "react";

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#34d399" strokeWidth="1.5"/>
      <path d="M5 8l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
      <path d="M10 6L6 10M6 6l4 4" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#c084fc" strokeWidth="1.5"/>
      <path d="M8 7v4M8 5.5v.5" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#fbbf24" strokeWidth="1.5"/>
      <path d="M8 5v4M8 10.5v.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const COLORS = {
  success: { border: "rgba(52,211,153,0.3)", bg: "rgba(52,211,153,0.06)" },
  error:   { border: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.06)" },
  info:    { border: "rgba(139,92,246,0.3)",  bg: "rgba(139,92,246,0.06)" },
  warning: { border: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.06)" },
};

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
      {toasts.map(t => {
        const c = COLORS[t.type] || COLORS.info;
        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            style={{
              display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
              padding: "12px 14px", borderRadius: 10,
              background: `linear-gradient(135deg, ${c.bg}, rgba(13,13,31,0.95))`,
              border: `1px solid ${c.border}`,
              backdropFilter: "blur(16px)",
              animation: "toastIn 0.3s ease forwards",
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}`,
            }}
          >
            <div style={{ marginTop: 1 }}>{ICONS[t.type] || ICONS.info}</div>
            <span style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-display)", lineHeight: 1.5, flex: 1 }}>
              {t.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
