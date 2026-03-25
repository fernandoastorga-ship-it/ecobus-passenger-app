import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession } from '../utils/auth'

export default function BottomNav() {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard">Inicio</NavLink>
      <NavLink to="/qr">QR</NavLink>
      <NavLink to="/history">Historial</NavLink>
      <NavLink to="/payments">Pagos</NavLink>
      <NavLink to="/legal">Legal</NavLink>
      <button type="button" className="link-button" onClick={handleLogout}>Salir</button>
    </nav>
  )
}
