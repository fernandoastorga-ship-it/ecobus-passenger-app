import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyOtp } from '../api/auth'
import { getSavedIdentifier, saveSession } from '../utils/auth'

export default function VerifyOtpPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialIdentifier = useMemo(() => location.state?.identifier || getSavedIdentifier(), [location.state])

  const [identifier, setIdentifier] = useState(initialIdentifier)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await verifyOtp(identifier.trim(), code.trim())
      saveSession({ accessToken: response.access_token, identifier: identifier.trim() })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'No fue posible validar el código')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card">
        <h1>Verificar código</h1>
        <p>Ingresa el OTP que te llegó para entrar a tu cuenta.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Correo o teléfono
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </label>
          <label>
            Código OTP
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Ingresar'}
          </button>
        </form>
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </div>
  )
}
