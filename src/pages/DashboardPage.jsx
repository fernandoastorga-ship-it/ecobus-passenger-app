import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import LoadingScreen from '../components/LoadingScreen'
import PageHeader from '../components/PageHeader'
import { formatDateTime } from '../utils/format'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setData).catch((err) => setError(err.message || 'No fue posible cargar el dashboard'))
  }, [])

  if (error) return <div className="card"><p className="error-text">{error}</p></div>
  if (!data) return <LoadingScreen text="Cargando dashboard..." />

  return (
    <>
      <PageHeader title="Inicio" subtitle={`Bienvenido, ${data.passenger.full_name}`} />
      <div className="card-grid">
        <section className="card">
          <h2>Tu plan</h2>
          <p><strong>Estado:</strong> {data.subscription.status}</p>
          <p><strong>Plan:</strong> {data.subscription.plan_type || 'Sin plan'}</p>
          <p><strong>Pagado:</strong> {data.subscription.payment_status || '—'}</p>
          <p><strong>Viajes incluidos:</strong> {data.subscription.rides_included}</p>
          <p><strong>Viajes usados:</strong> {data.subscription.rides_used}</p>
          <p><strong>Viajes restantes:</strong> {data.subscription.rides_remaining}</p>
        </section>

        <section className="card">
          <h2>Tu cuenta</h2>
          <p><strong>Correo:</strong> {data.passenger.email || '—'}</p>
          <p><strong>Teléfono:</strong> {data.passenger.phone || '—'}</p>
          <p><strong>Punto de subida:</strong> {data.passenger.pickup_point || '—'}</p>
          <p><strong>Último acceso:</strong> {formatDateTime(data.passenger.last_login_at)}</p>
        </section>
      </div>
    </>
  )
}
