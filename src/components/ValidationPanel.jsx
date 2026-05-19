import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const VALIDATION_ADDRESS = '0x8004Cb1BF31DAf7788923b405b754f57acEB4272'

const VALIDATION_ABI = [
  `function validationRequest(
    address validator,
    uint256 agentId,
    string requestURI,
    bytes32 requestHash
  ) external`,
]

const DEFAULT_VALIDATOR = '0xb3CF6b5a6aa8ED4E1309Fd0631DEB6cB06B7AFcA'
const DEFAULT_REQUEST_URI = 'ipfs://validation-request'

export default function ValidationPanel({
  signer,
  agentId: sharedAgentId,
  addActivity,
  arcExplorer,
}) {
  const [agentId, setAgentId] = useState('')
  const [validator, setValidator] = useState(DEFAULT_VALIDATOR)
  const [requestURI, setRequestURI] = useState(DEFAULT_REQUEST_URI)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (sharedAgentId) {
      setAgentId(sharedAgentId.toString())
    }
  }, [sharedAgentId])

  useEffect(() => {
    if (!success && !error) return

    const timer = setTimeout(() => {
      setSuccess(null)
      setError(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [success, error])

  const resetSubmissionState = () => {
    setSubmitted(false)
    setSuccess(null)
    setError(null)
  }

  const handleRequest = async () => {
    if (!signer) return

    if (!agentId.trim()) {
      setError('Agent ID is required')
      return
    }

    if (!validator.trim() || !ethers.isAddress(validator.trim())) {
      setError('Valid validator address required')
      return
    }

    if (!requestURI.trim()) {
      setError('Request URI required')
      return
    }

    setLoading(true)

    try {
      const contract = new ethers.Contract(
        VALIDATION_ADDRESS,
        VALIDATION_ABI,
        signer
      )

      const requestHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          JSON.stringify({
            agentId,
            validator,
            requestURI,
            timestamp: Date.now(),
          })
        )
      )

      const tx = await contract.validationRequest(
        validator.trim(),
        BigInt(agentId.trim()),
        requestURI.trim(),
        requestHash
      )

      await tx.wait()

      setSuccess({ txHash: tx.hash })
      setSubmitted(true)

      addActivity({
        type: 'validation',
        label: 'Validation Request',
        agentId: agentId.trim(),
        validator,
        txHash: tx.hash,
        status: 'success',
      })
    } catch (e) {
      const msg =
        e?.reason ||
        e?.shortMessage ||
        e?.message ||
        'Validation request failed'

      setError(msg)

      addActivity({
        type: 'validation',
        label: 'Validation Failed',
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
        <span className="panel-icon">🛡️</span>
        <h2>Request Validation</h2>
      </div>

      <p className="panel-desc">
        Request validator review for your registered agent.
      </p>

      <div className="field-group">
        <label>
          Agent ID
          {sharedAgentId && (
            <span className="auto-filled-badge">auto-filled</span>
          )}
        </label>

        <input
          type="number"
          value={agentId}
          onChange={(e) => {
            resetSubmissionState()
            setAgentId(e.target.value)
          }}
          disabled={loading}
        />
      </div>

      <div className="field-group">
        <label>
          Validator Address
          <span className="auto-filled-badge">default</span>
        </label>

        <input
          type="text"
          value={validator}
          onChange={(e) => {
            resetSubmissionState()
            setValidator(e.target.value)
          }}
          disabled={loading}
        />
      </div>

      <div className="field-group">
        <label>Request URI</label>

        <input
          type="text"
          value={requestURI}
          onChange={(e) => {
            resetSubmissionState()
            setRequestURI(e.target.value)
          }}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div>✅ Validation request submitted!</div>

          <a
            href={`${arcExplorer}/tx/${success.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transaction ↗
          </a>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleRequest}
        disabled={loading || !signer || submitted}
      >
        {submitted
          ? '✓ Already Submitted'
          : loading
          ? 'Requesting...'
          : 'Submit Validation Request'}
      </button>
    </div>
  )
}