import React from "react";
import { EXPLORER } from "../lib/config";

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export function ActivityFeed({ txHistory }) {
  return (
    <div className="glass" style={{ padding: "24px", animation: "fadeIn 0.35s ease forwards" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(192,132,252,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--arc-pink)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h2l2-5 2 10 2-7 2 4 1-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div className="section-title" style={{ marginBottom: 0 }}>Activity Feed</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Recent transactions</div>
        </div>
        {txHistory.length > 0 && (
          <div style={{ marginLeft: "auto" }}>
            <span className="badge badge-info">{txHistory.length} txs</span>
          </div>
        )}
      </div>
      <div className="divider" />

      {txHistory.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(139,92,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "var(--text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9h3l2.5-6.5 3 12.5 2.5-8 2 4H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No transactions yet</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.6, marginTop: 4 }}>Your on-chain activity will appear here</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {txHistory.map((tx, i) => (
            <div
              key={`${tx.hash}-${i}`}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                borderRadius: 10, animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                transition: "var(--transition)",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-mid)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: tx.status === "success" ? "var(--arc-green)" : tx.status === "pending" ? "var(--arc-amber)" : "var(--arc-red)",
                boxShadow: `0 0 6px ${tx.status === "success" ? "var(--arc-green)" : tx.status === "pending" ? "var(--arc-amber)" : "var(--arc-red)"}`,
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{tx.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tx.hash.slice(0, 18)}…{tx.hash.slice(-6)}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{timeAgo(tx.ts)}</span>
                <span className={`badge ${tx.status === "success" ? "badge-success" : tx.status === "pending" ? "badge-pending" : "badge-error"}`} style={{ fontSize: 10 }}>
                  {tx.status}
                </span>
                <a
                  href={`${EXPLORER}/tx/${tx.hash}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    width: 26, height: 26, borderRadius: 6, background: "rgba(139,92,246,0.1)",
                    border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "var(--arc-purple)", textDecoration: "none",
                    transition: "var(--transition)", flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; }}
                  title="View on ArcScan"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
