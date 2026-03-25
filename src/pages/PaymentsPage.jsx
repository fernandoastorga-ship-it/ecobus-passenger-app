import { useEffect, useState } from 'react'
import { getPayments } from '../api/payments'
import LoadingScreen from '../components/LoadingScreen'
import PageHeader from '../components/PageHeader'
import { formatDate } from '../utils/format'

export default function PaymentsPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPayments().then(setData).catch((err) => setError(err.message || 'No fue posible cargar pagos'))
  }, [])

  if (error) return <div className="card"><p className="error-text">{error}</p></div>
  if (!data) return <LoadingScreen text="Cargando pagos..." />

  return (
    <>
      <PageHeader title="Pagos" subtitle={data.passenger.full_name} />
      <section className="card">
        <h2>Plan mensual</h2>
        <p><strong>Tiene plan:</strong> {data.monthly_plan.has_monthly_plan ? 'Sí' : 'No'}</p>
        <p><strong>Mes:</strong> {formatDate(data.monthly_plan.month)}</p>
        <p><strong>Plan:</strong> {data.monthly_plan.plan_type || '—'}</p>
        <p><strong>Estado pago:</strong> {data.monthly_plan.payment_status || '—'}</p>
        <p><strong>Viajes restantes:</strong> {data.monthly_plan.rides_remaining}</p>
      </section>

      <section className="card">
        <h2>Pase diario de hoy</h2>
        <p><strong>Tiene pase diario:</strong> {data.daily_pass_today.has_daily_pass_today ? 'Sí' : 'No'}</p>
        <p><strong>Estado pago:</strong> {data.daily_pass_today.payment_status || '—'}</p>
        <p><strong>Reserva:</strong> {data.daily_pass_today.reservation_status || '—'}</p>
        <p><strong>Viaje:</strong> {data.daily_pass_today.trip_type || '—'}</p>
      </section>
    </>
  )
}
