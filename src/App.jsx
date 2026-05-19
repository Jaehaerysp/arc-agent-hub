import { useState } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './hooks/useWallet'
import AgentPanel from './components/AgentPanel'
import ReputationPanel from './components/ReputationPanel'
import ValidationPanel from './components/ValidationPanel'
import Dashboard from './components/Dashboard'
import './index.css'

const ANV_TOKEN = '0x736223037D622ed365fa641a116daAcED7A5be96'

const ANV_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
]

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'register', label: 'Register Agent', icon: '🤖' },
  { id: 'reputation', label: 'Reputation', icon: '⭐' },
  { id: 'validation', label: 'Validation', icon: '🛡️' },
  { id: 'transfer', label: 'Transfer ANV', icon: '💸' },
]

function shortAddr(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function TransferPanel({ signer, addActivity, arcExplorer }) {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const resetState = () => {
    setSubmitted(false)
    setError(null)
    setSuccess(null)
  }

  const handleTransfer = async () => {
    if (!signer) return

    if (!to.trim() || !ethers.isAddress(to.trim())) {
      setError('Valid recipient address required')
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('Valid amount required')
      return
    }

    setLoading(true)

    try {
      const contract = new ethers.Contract(
        ANV_TOKEN,
        ANV_ABI,
        signer
      )

      const parsedAmount = ethers.parseUnits(amount, 18)

      const tx = await contract.transfer(
        to.trim(),
        parsedAmount
      )

      await tx.wait()

      setSuccess({ txHash: tx.hash })
      setSubmitted(true)

      addActivity({
        type: 'transfer',
        label: 'ANV Transfer',
        txHash: tx.hash,
        status: 'success',
      })
    } catch (e) {
      const msg =
        e?.reason ||
        e?.shortMessage ||
        e?.message ||
        'Transfer failed'

      setError(msg)

      addActivity({
        type: 'transfer',
        label: 'Transfer Failed',
        status: 'error',
        detail: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">💸</span>
        <h2>Transfer ANV</h2>
      </div>

      <p className="panel-desc">
        Send ANV tokens on Arc Testnet.
      </p>

      <div className="field-group">
        <label>Recipient Address</label>
        <input
          type="text"
          value={to}
          onChange={(e) => {
            resetState()
            setTo(e.target.value)
          }}
          disabled={loading}
        />
      </div>

      <div className="field-group">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            resetState()
            setAmount(e.target.value)
          }}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">
          <a
            href={`${arcExplorer}/tx/${success.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transfer ↗
          </a>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleTransfer}
        disabled={loading || !signer || submitted}
      >
        {submitted
          ? '✓ Sent'
          : loading
          ? 'Sending...'
          : 'Send ANV'}
      </button>
    </div>
  )
}

export default function App() {
  const {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error: walletError,
    isArcNetwork,
    agentId,
    setAgentId,
    activity,
    addActivity,
    connect,
    disconnect,
    switchToArc,
    copyAddress,
    ARC_EXPLORER,
  } = useWallet()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyAddress()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">ARC</div>
          <div className="brand-sub">Agent Hub</div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${
                activeTab === tab.id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>

              {tab.id === 'register' && agentId && (
                <span className="nav-badge">#{agentId}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="network-badge">
            {isArcNetwork ? 'Arc Testnet' : `Chain ${chainId || '—'}`}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="app-header">
          <h1>
            {TABS.find((t) => t.id === activeTab)?.icon}{' '}
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>

          <div className="header-right">
            {account ? (
              <>
                {!isArcNetwork && (
                  <button
                    className="btn btn-warning"
                    onClick={switchToArc}
                  >
                    Switch to Arc
                  </button>
                )}

                <button
                  className="btn btn-ghost"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied' : shortAddr(account)}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        {walletError && (
          <div className="alert alert-error">
            {walletError}
          </div>
        )}

        {account && (
          <div className="tab-content">
            {activeTab === 'dashboard' && (
              <Dashboard
                provider={provider}
                account={account}
                activity={activity}
                agentId={agentId}
                arcExplorer={ARC_EXPLORER}
              />
            )}

            {activeTab === 'register' && (
              <AgentPanel
                signer={signer}
                account={account}
                setAgentId={setAgentId}
                addActivity={addActivity}
                arcExplorer={ARC_EXPLORER}
              />
            )}

            {activeTab === 'reputation' && (
              <ReputationPanel
                signer={signer}
                agentId={agentId}
                addActivity={addActivity}
                arcExplorer={ARC_EXPLORER}
              />
            )}

            {activeTab === 'validation' && (
              <ValidationPanel
                signer={signer}
                agentId={agentId}
                addActivity={addActivity}
                arcExplorer={ARC_EXPLORER}
              />
            )}

            {activeTab === 'transfer' && (
              <TransferPanel
                signer={signer}
                addActivity={addActivity}
                arcExplorer={ARC_EXPLORER}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}