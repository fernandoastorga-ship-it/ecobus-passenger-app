export default function LoadingScreen({ message = "Cargando información..." }) {
  return (
    <div className="ecobus-app">
      <div className="ecobus-loading">
        <div className="ecobus-loading__card">
          <div className="ecobus-spinner" />
          <h2 className="ecobus-section-title" style={{ marginBottom: 8 }}>
            Un momento
          </h2>
          <p className="ecobus-subtitle">{message}</p>
        </div>
      </div>
    </div>
  );
}
