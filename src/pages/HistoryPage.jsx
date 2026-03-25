import { useEffect, useState } from 'react'
import { getHistory } from '../api/history'
import LoadingScreen from '../components/LoadingScreen'
import PageHeader from '../components/PageHeader'
import { formatDateTime, formatDate } from '../utils/format'

export default function HistoryPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getHistory().then(setData).catch((err) => setError(err.message || 'No fue posible cargar el historial'))
  }, [])

  if (error) return <div className="card"><p className="error-text">{error}</p></div>
  if (!data) return <LoadingScreen text="Cargando historial..." />

  return (
    <>
      <PageHeader title="Historial" subtitle={`Total registros: ${data.pagination.total}`} />
      {data.items.length === 0 ? (
        <div className="card"><p>No tienes registros todavía.</p></div>
      ) : (
        data.items.map((item) => (
          <section key={item.id} className="card">
            <p><strong>Fecha escaneo:</strong> {formatDateTime(item.created_at)}</p>
            <p><strong>Fecha servicio:</strong> {formatDate(item.service_date)}</p>
            <p><strong>Viaje:</strong> {item.trip_type}</p>
            <p><strong>Punto:</strong> {item.pickup_point}</p>
            <p><strong>Resultado:</strong> {item.result}</p>
            <p><strong>Motivo:</strong> {item.reason || '—'}</p>
          </section>
        ))
      )}
    </>
  )
}
