import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Logo from '../components/Logo'

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const submit = async e => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email.'); return }
    setError('')
    setLoading(true)
    try {
      await api.forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={{ marginBottom: 28 }}>
          <Logo size={36} />
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📬</div>
            <h1 style={s.title}>Check your inbox</h1>
            <p style={s.sub}>
              We sent a password reset link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
              It expires in 1 hour.
            </p>
            <p style={{ ...s.sub, marginTop: 12 }}>
              Didn't get it? Check your spam folder, or{' '}
              <button onClick={() => setSent(false)} style={s.link}>try again</button>.
            </p>
            <Link to="/auth" className="btn btn-ghost btn-full" style={{ marginTop: 24 }}>
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={s.title}>Forgot your password?</h1>
            <p style={s.sub}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
              <div className="field">
                <label>Email address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255,70,70,0.1)', border: '1px solid rgba(255,70,70,0.3)',
                  borderRadius: 10, padding: '10px 14px',
                  color: '#ff6b6b', fontSize: '0.85rem',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ marginTop: 4 }}
              >
                {loading ? <span className="spinner" /> : 'Send reset link →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/auth" style={s.link}>← Back to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'rgba(15,15,26,0.95)',
    backdropFilter: 'blur(24px)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '40px 36px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    margin: '0 0 8px',
  },
  sub: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: 0,
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
