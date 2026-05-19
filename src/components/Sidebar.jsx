import React from "react";

const NAV = [
  {
    id: "dashboard", label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "agents", label: "Agents",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "reputation", label: "Reputation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.128L8 10.5l-3.708 2.06L5 8.451 2 5.528l4.146-.772L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "validation", label: "Validation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L14 4v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5.5 8l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "transfers", label: "Transfers",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 5h10M9 2l3 3-3 3M14 11H4M7 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "activity", label: "Activity",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8h2l2-5 2 10 2-7 2 4 1-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: "var(--sidebar-w)", height: "100vh", position: "fixed", left: 0, top: 0,
      background: "var(--bg-deep)", borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px", height: "var(--header-h)", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "var(--grad-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9"/>
            <path d="M7 5L9.598 6.5V9.5L7 11L4.402 9.5V6.5L7 5Z" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.2 }}>Arc Agent</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Hub</div>
        </div>
      </div>

      {/* Network badge */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
          background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--arc-green)", boxShadow: "0 0 6px var(--arc-green)", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--arc-neon)", fontFamily: "var(--font-mono)" }}>Arc Testnet</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "4px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 8px 10px" }}>Navigation</div>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                marginBottom: 2,
                background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                color: isActive ? "var(--arc-neon)" : "var(--text-secondary)",
                fontFamily: "var(--font-display)", fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: "var(--transition)",
                borderLeft: isActive ? "2px solid var(--arc-purple)" : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(139,92,246,0.06)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Chain ID: 5042002
        </div>
        <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "var(--arc-purple)", fontFamily: "var(--font-mono)", textDecoration: "none" }}>
          ArcScan ↗
        </a>
      </div>
    </aside>
  );
}
