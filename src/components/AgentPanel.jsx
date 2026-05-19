import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const IDENTITY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e'

const IDENTITY_ABI = [
  'function register(string metadataURI) external returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]

export default function AgentPanel({
  signer,
  account,
  setAgentId,
  addActivity,
  arcExplorer,
}) {
  const [metadataURI, setMetadataURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!success && !error) return

    const timer = setTimeout(() => {
      setSuccess(null)
      setError(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [success, error])

  const resetState = () => {
    setSubmitted(false)
    setSuccess(null)
    setError(null)
  }

  const handleRegister = async () => {
    if (!signer) return

    if (!metadataURI.trim()) {
      setError('Metadata URI is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const contract = new ethers.Contract(
        IDENTITY_ADDRESS,
        IDENTITY_ABI,
        signer
      )

      const tx = await contract.register(metadataURI.trim())
      const receipt = await tx.wait()

      const iface = new ethers.Interface(IDENTITY_ABI)

      let registeredAgentId = null

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log)

          if (parsed && parsed.name === 'Transfer') {
            registeredAgentId = parsed.args.tokenId.toString()
            break
          }
        } catch (_) {}
      }

      if (!registeredAgentId) {
        registeredAgentId = receipt.logs?.[0]?.topics?.[3]
          ? BigInt(receipt.logs[0].topics[3]).toString()
          : 'Unknown'
      }

      setAgentId(registeredAgentId)

      setSuccess({
        agentId: registeredAgentId,
        txHash: tx.hash,
      })

      setSubmitted(true)

      addActivity({
        type: 'register',
        label: 'Agent Registered',
        agentId: registeredAgentId,
        txHash: tx.hash,
        status: 'success',
      })
    } catch (e) {
      const msg =
        e?.reason ||
        e?.shortMessage ||
        e?.message ||
        'Registration failed'

      setError(msg)

      addActivity({
        type: 'register',
        label: 'Agent Registration Failed',
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
        <span className="panel-icon">🤖</span>
        <h2>Register Agent</h2>
      </div>

      <p className="panel-desc">
        Register a new AI agent on Arc Testnet. Your Agent ID will be
        automatically saved and reused across Validation + Reputation.
      </p>

      <div className="field-group">
        <label>Metadata URI</label>

        <input
          type="text"
          placeholder="ipfs://Qm... or https://..."
          value={metadataURI}
          onChange={(e) => {
            resetState()
            setMetadataURI(e.target.value)
          }}
          disabled={loading}
        />

        <span className="field-hint">
          Agent metadata JSON URI
        </span>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div>✅ Agent registered successfully!</div>

          <div className="detail-row">
            <span>Agent ID:</span>
            <strong className="accent">
              #{success.agentId}
            </strong>
          </div>

          <div className="detail-row">
            <span>Tx:</span>

            <a
              href={`${arcExplorer}/tx/${success.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              {success.txHash.slice(0, 18)}…
            </a>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleRegister}
        disabled={loading || !signer || submitted}
      >
        {submitted ? (
          '✓ Already Registered'
        ) : loading ? (
          <>
            <span className="spinner" />
            Registering…
          </>
        ) : (
          'Register Agent'
        )}
      </button>
    </div>
  )
}