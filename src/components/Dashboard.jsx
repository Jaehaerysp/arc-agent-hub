import { useState } from 'react'

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function shortHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}

export default function Dashboard({
  account,
  activity,
  agentId,
  arcExplorer,
}) {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Wallet Connected</div>
          <div className="stat-value">
            {account ? 'YES' : 'NO'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Your Agent ID</div>
          <div className="stat-value accent">
            {agentId ? `#${agentId}` : '—'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completed Actions</div>
          <div className="stat-value">
            {activity.filter(a => a.status === 'success').length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Activity Events</div>
          <div className="stat-value">
            {activity.length}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Activity Feed</h2>
      </div>

      {activity.length === 0 ? (
        <div className="panel">
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="activity-list">
          {activity.map((item) => (
            <div
              key={item.id}
              className={`activity-item ${item.status}`}
            >
              <div className="activity-main">
                <div className="activity-title">
                  {item.label}
                </div>

                {item.agentId && (
                  <div className="activity-agent">
                    Agent #{item.agentId}
                  </div>
                )}

                {item.detail && (
                  <div className="activity-detail">
                    {item.detail}
                  </div>
                )}
              </div>

              <div className="activity-meta">
                {item.txHash && (
                  <a
                    href={`${arcExplorer}/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    {shortHash(item.txHash)}
                  </a>
                )}

                <div className="activity-time">
                  {formatTime(item.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}