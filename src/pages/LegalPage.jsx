import { useEffect, useState } from 'react'
import { acceptLegal, getLegal } from '../api/legal'
import LoadingScreen from '../components/LoadingScreen'
import PageHeader from '../components/PageHeader'
import { formatDateTime } from '../utils/format'

export default function LegalPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loadingAccept, setLoadingAccept] = useState(false)

  async function loadData() {
    try {
      setError('')
      const response = await getLegal()
      setData(response)
    } catch (err) {
      setError(err.message || 'No fue posible cargar el documento legal')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAccept() {
    try {
      setLoadingAccept(true)
      await acceptLegal()
      await loadData()
    } catch (err) {
      setError(err.message || 'No fue posible aceptar los términos')
    } finally {
      setLoadingAccept(false)
    }
  }

  if (error) return <div className="card"><p className="error-text">{error}</p></div>
  if (!data) return <LoadingScreen text="Cargando términos..." />

  return (
    <>
      <PageHeader title="Legal" subtitle={data.document.title} />
      <section className="card">
        <p><strong>Versión actual:</strong> {data.document.version}</p>
        <pre className="legal-text">{data.document.content}</pre>
      </section>
      <section className="card">
        <p><strong>Aceptado:</strong> {data.acceptance.accepted ? 'Sí' : 'No'}</p>
        <p><strong>Versión aceptada:</strong> {data.acceptance.accepted_terms_version || '—'}</p>
        <p><strong>Fecha aceptación:</strong> {formatDateTime(data.acceptance.accepted_terms_at)}</p>
        {!data.acceptance.accepted ? (
          <button onClick={handleAccept} disabled={loadingAccept}>
            {loadingAccept ? 'Aceptando...' : 'Aceptar términos'}
          </button>
        ) : null}
      </section>
    </>
  )
}
