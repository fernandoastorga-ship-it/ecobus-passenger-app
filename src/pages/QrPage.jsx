import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { getQrBundle } from '../api/qr'
import LoadingScreen from '../components/LoadingScreen'
import PageHeader from '../components/PageHeader'
import { formatDateTime, formatDate } from '../utils/format'

function QrCard({ title, qrData, subtitle }) {
  if (!qrData?.available) return null

  return (
    <section className="card qr-card">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      <div className="qr-box">
        <QRCode value={qrData.qr_url} size={220} />
      </div>
      <p><strong>Vigencia desde:</strong> {formatDateTime(qrData.valid_from || qrData.service_date)}</p>
      <p><strong>Vigencia hasta:</strong> {formatDateTime(qrData.valid_to)}</p>
      <p><strong>Tipo viaje:</strong> {qrData.trip_type || 'Mensual'}</p>
    </section>
  )
}

export default function QrPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getQrBundle().then(setData).catch((err) => setError(err.message || 'No fue posible cargar tus QR'))
  }, [])

  if (error) return <div className="card"><p className="error-text">{error}</p></div>
  if (!data) return <LoadingScreen text="Cargando QR..." />

  return (
    <>
      <PageHeader title="Mis QR" subtitle={data.passenger.full_name} />
      <QrCard title="QR mensual" qrData={data.monthly_qr} />
      <QrCard
        title="QR pase diario"
        qrData={data.daily_pass_qr}
        subtitle={data.daily_pass_qr?.service_date ? `Servicio ${formatDate(data.daily_pass_qr.service_date)}` : ''}
      />
      {!data.monthly_qr?.available && !data.daily_pass_qr?.available ? (
        <div className="card">
          <p>No tienes un QR disponible en este momento.</p>
        </div>
      ) : null}
    </>
  )
}
