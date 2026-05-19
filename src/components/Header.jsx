import React, { useState } from "react";

export function Header({ address, onConnect, onDisconnect, connecting }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const short = a => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";

  return (
    <header style={{
      height: "var(--header-h)", position: "fixed",
      left: "var(--sidebar-w)", right: 0, top: 0,
      background: "rgba(7,7,18,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", zIndex: 90,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 1, height: 20, background: "var(--border-subtle)", marginRight: 8 }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ERC-8004 AI Identity Protocol</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {address ? (
          <>
            {/* Network pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 100,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--arc-green)", boxShadow: "0 0 4px var(--arc-green)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--arc-green)", fontFamily: "var(--font-mono)" }}>Arc Testnet</span>
            </div>

            {/* Address */}
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              background: "var(--bg-raised)", border: "1px solid var(--border-subtle)",
              borderRadius: 8, overflow: "hidden",
            }}>
              <span style={{ padding: "6px 12px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {short(address)}
              </span>
              <button
                onClick={copyAddress}
                title="Copy address"
                style={{
                  padding: "6px 10px", background: "transparent", border: "none",
                  borderLeft: "1px solid var(--border-subtle)", cursor: "pointer",
                  color: copied ? "var(--arc-green)" : "var(--text-muted)",
                  transition: "var(--transition)", display: "flex", alignItems: "center",
                }}
              >
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="1" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4v7h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                )}
              </button>
            </div>

            {/* Disconnect */}
            <button
              className="btn-ghost"
              onClick={onDisconnect}
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 6H11M9 3.5L11.5 6 9 8.5M7 1H2a1 1 0 00-1 1v8a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Disconnect
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={onConnect} disabled={connecting} style={{ padding: "7px 18px", fontSize: 12 }}>
            {connecting ? <span className="spinner" style={{ width: 12, height: 12 }} /> : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            )}
            {connecting ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
