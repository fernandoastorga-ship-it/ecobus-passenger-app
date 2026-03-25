export default function LoadingScreen({ text = 'Cargando...' }) {
  return (
    <div className="card center-card">
      <p>{text}</p>
    </div>
  )
}
