import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestOtp } from '../api/auth'
import { getSavedIdentifier } from '../utils/auth'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(getSavedIdentifier())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const cleaned = identifier.trim()
      await requestOtp(cleaned)
      setMessage('Código enviado. Continúa con la verificación.')
      navigate('/verify-otp', { state: { identifier: cleaned } })
    } catch (err) {
      setError(err.message || 'No fue posible enviar el código')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card">
        <h1>Ecobus Pasajeros</h1>
        <p>Ingresa tu correo o teléfono para recibir tu código de acceso.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Correo o teléfono
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="correo@ejemplo.cl o +569..."
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </div>
  )
}
