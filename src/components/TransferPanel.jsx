import React, { useState } from "react";
import { EXPLORER } from "../lib/config";

export function TransferPanel({ transferANV, anvBalance, address, toast }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const handleTransfer = async () => {
    if (!recipient.trim() || !amount.trim()) { toast("Fill all fields", "warning"); return; }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { toast("Invalid amount", "warning"); return; }
    setLoading(true);
    try {
      const txHash = await transferANV(recipient.trim(), amount.trim());
      setLastTx({ txHash, amount, recipient });
      setRecipient(""); setAmount("");
      toast(`Transferred ${amount} ANV`, "success");
    } catch (e) {
      toast(e?.reason || e?.message || "Transfer failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: "24px", animation: "fadeIn 0.35s ease forwards" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(56,189,248,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--arc-cyan)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h10M9 2l3 3-3 3M14 11H4M7 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div className="section-title" style={{ marginBottom: 0 }}>Transfer ANV</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ERC-20 Token Transfer</div>
        </div>
        {address && (
          <div style={{ marginLeft: "auto", padding: "4px 10px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 100 }}>
            <span style={{ fontSize: 11, color: "var(--arc-cyan)", fontFamily: "var(--font-mono)" }}>Balance: {anvBalance} ANV</span>
          </div>
        )}
      </div>
      <div className="divider" />

      <div style={{ marginBottom: 12 }}>
        <label className="label">Recipient Address</label>
        <input className="input-field" placeholder="0x…" value={recipient} onChange={e => setRecipient(e.target.value)} disabled={loading || !address} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label className="label">Amount</label>
        <div style={{ position: "relative" }}>
          <input
            className="input-field"
            placeholder="0.0"
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={loading || !address}
            style={{ paddingRight: 60 }}
          />
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ANV</span>
        </div>
        {address && (
          <button
            onClick={() => setAmount(anvBalance)}
            style={{ fontSize: 11, color: "var(--arc-purple)", background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: 0 }}
          >
            Use max ({anvBalance})
          </button>
        )}
      </div>

      {!address ? (
        <div style={{ padding: "10px 14px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, fontSize: 12, color: "var(--arc-amber)" }}>Connect wallet first</div>
      ) : (
        <button className="btn-primary" onClick={handleTransfer} disabled={loading || !recipient.trim() || !amount.trim()} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h8M8 1.5L11 4l-3 2.5M12 10H4M6 7.5L3 10l3 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {loading ? "Sending…" : "Send ANV"}
        </button>
      )}

      {lastTx && (
        <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, animation: "fadeIn 0.3s ease forwards" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--arc-green)" }}>✓ Transfer Confirmed</span>
            <span className="badge badge-success">{lastTx.amount} ANV</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
            To: {lastTx.recipient.slice(0, 16)}…
          </div>
          <a href={`${EXPLORER}/tx/${lastTx.txHash}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--arc-purple)", textDecoration: "none" }}>View on ArcScan ↗</a>
        </div>
      )}
    </div>
  );
}
