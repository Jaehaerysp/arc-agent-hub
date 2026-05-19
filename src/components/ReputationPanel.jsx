import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const REPUTATION_ADDRESS = '0x8004B663056A597Dffe9eCcC1965A193B7388713'

const REPUTATION_ABI = [
  'function giveFeedback(uint256 agentId,int128 score,uint8 feedbackType,string tag,string metadataURI,string evidenceURI,string comment,bytes32 feedbackHash)'
]

const FEEDBACK_TYPES = {
  Peer: 1,
  Validator: 2,
  Community: 3,
}

const SCORE_LABELS = [
  '',
  '😞 Terrible',
  '😟 Very Poor',
  '😕 Poor',
  '😐 Below Avg',
  '🙂 Average',
  '😊 Good',
  '😀 Very Good',
  '🤩 Excellent',
  '⭐ Outstanding',
  '🏆 Perfect',
]

export default function ReputationPanel({
  signer,
  agentId: sharedAgentId,
  addActivity,
  arcExplorer,
}) {
  const [agentId, setAgentId] = useState('')
  const [score, setScore] = useState(8)
  const [feedbackType, setFeedbackType] = useState('Validator')
  const [tag, setTag] = useState('validated_agent')

  const [metadataURI, setMetadataURI] = useState(
    'ipfs://bafkreihanmd4ksidq5v4qwi3hdf3g42fnttmsdzzfelzkczi77svr4vmu4'
  )

  const [evidenceURI, setEvidenceURI] = useState(
    'ipfs://bafkreiak2pj4452l5i6325zdpf3aolek7cfa4lr4czchvbjxa4sba6k6py'
  )

  const [comment, setComment] = useState(
    'Third-party validator review for successful Arc protocol workflow execution.'
  )

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

  const handleSubmit = async () => {
    if (!signer) return

    setError(null)
    setSuccess(null)

    if (!agentId.trim()) {
      setError('Agent ID is required')
      return
    }

    if (!tag.trim()) {
      setError('Tag is required')
      return
    }

    if (!metadataURI.trim()) {
      setError('Metadata URI is required')
      return
    }

    if (!evidenceURI.trim()) {
      setError('Evidence URI is required')
      return
    }

    if (!comment.trim()) {
      setError('Comment is required')
      return
    }

    const scoreNum = Number(score)

    if (!Number.isInteger(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      setError('Score must be between 1 and 10')
      return
    }

    setLoading(true)

    try {
      const contract = new ethers.Contract(
        REPUTATION_ADDRESS,
        REPUTATION_ABI,
        signer
      )

      const feedbackTypeValue = FEEDBACK_TYPES[feedbackType]

      const reviewer = await signer.getAddress()

      const feedbackHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          JSON.stringify({
            agentId,
            score: scoreNum,
            feedbackType,
            tag,
            metadataURI,
            evidenceURI,
            comment,
            reviewer,
            timestamp: Date.now(),
          })
        )
      )

      await contract.giveFeedback(
        BigInt(agentId.trim()),
        BigInt(scoreNum),
        feedbackTypeValue,
        tag.trim(),
        metadataURI.trim(),
        evidenceURI.trim(),
        comment.trim(),
        feedbackHash
      )

      const tx = await contract.giveFeedback(
        BigInt(agentId.trim()),
        BigInt(scoreNum),
        feedbackTypeValue,
        tag.trim(),
        metadataURI.trim(),
        evidenceURI.trim(),
        comment.trim(),
        feedbackHash
      )

      await tx.wait()

      setSuccess({ txHash: tx.hash })
      setSubmitted(true)

      if (addActivity) {
        addActivity({
          type: 'feedback',
          label: 'Reputation Feedback',
          agentId: agentId.trim(),
          score: scoreNum,
          txHash: tx.hash,
          status: 'success',
        })
      }
    } catch (e) {
      const msg =
        e?.reason ||
        e?.shortMessage ||
        e?.message ||
        'Feedback submission failed'

      setError(msg)

      if (addActivity) {
        addActivity({
          type: 'feedback',
          label: 'Feedback Failed',
          status: 'error',
          detail: msg,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const pct = `${((score - 1) / 9) * 100}%`

  return (
    <div className="panel rep-panel">
      <div className="panel-header">
        <div className="rep-panel-icon-wrap">
          <span className="panel-icon">⭐</span>
        </div>

        <div>
          <h2>Reputation Feedback</h2>
          <p className="rep-panel-subtitle">
            Submit validator reputation via giveFeedback
          </p>
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>
            Agent ID
            {sharedAgentId && (
              <span className="auto-filled-badge">auto-filled</span>
            )}
          </label>

          <div className="rep-input-wrap">
            <span className="rep-input-prefix">#</span>

            <input
              className="rep-input rep-input-with-prefix"
              type="number"
              value={agentId}
              onChange={(e) => {
                resetSubmissionState()
                setAgentId(e.target.value)
              }}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="rep-section">
        <div className="rep-score-block">
          <div className="rep-score-header">
            <label>Score (1–10)</label>

            <div className="rep-score-display">
              <span className="rep-score-number">{score}</span>
              <span className="rep-score-max">/10</span>
              <span className="rep-score-emoji">{SCORE_LABELS[score]}</span>
            </div>
          </div>

          <input
            className="rep-slider"
            type="range"
            min="1"
            max="10"
            step="1"
            value={score}
            onChange={(e) => {
              resetSubmissionState()
              setScore(Number(e.target.value))
            }}
            disabled={loading}
            style={{ '--pct': pct }}
          />
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>Feedback Type</label>

          <select
            className="rep-input"
            value={feedbackType}
            onChange={(e) => {
              resetSubmissionState()
              setFeedbackType(e.target.value)
            }}
            disabled={loading}
          >
            <option>Peer</option>
            <option>Validator</option>
            <option>Community</option>
          </select>
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>Tag</label>

          <input
            className="rep-input"
            value={tag}
            onChange={(e) => {
              resetSubmissionState()
              setTag(e.target.value)
            }}
            disabled={loading}
          />
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>Metadata URI</label>

          <input
            className="rep-input"
            value={metadataURI}
            onChange={(e) => {
              resetSubmissionState()
              setMetadataURI(e.target.value)
            }}
            disabled={loading}
          />
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>Evidence URI</label>

          <input
            className="rep-input"
            value={evidenceURI}
            onChange={(e) => {
              resetSubmissionState()
              setEvidenceURI(e.target.value)
            }}
            disabled={loading}
          />
        </div>
      </div>

      <div className="rep-section">
        <div className="field-group">
          <label>Comment</label>

          <textarea
            className="rep-input"
            rows="4"
            value={comment}
            onChange={(e) => {
              resetSubmissionState()
              setComment(e.target.value)
            }}
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="rep-alert rep-alert-error">
          <span className="rep-alert-icon">⚠</span>
          <div className="rep-alert-body">
            <span className="rep-alert-title">Submission Failed</span>
            <span className="rep-alert-msg">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="rep-alert rep-alert-success">
          <span className="rep-alert-icon">✓</span>
          <div className="rep-alert-body">
            <span className="rep-alert-title">
              Feedback submitted successfully
            </span>

            <a
              href={`${arcExplorer}/tx/${success.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View Transaction ↗
            </a>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary rep-submit"
        onClick={handleSubmit}
        disabled={loading || !signer || submitted}
      >
        {submitted ? (
          '✓ Already Submitted'
        ) : loading ? (
          <>
            <span className="spinner" />
            Submitting...
          </>
        ) : (
          <>
            <span className="rep-submit-icon">⭐</span>
            Submit Feedback
          </>
        )}
      </button>

      {!signer && (
        <p className="rep-no-wallet">
          Connect wallet to submit validator feedback
        </p>
      )}
    </div>
  )
}