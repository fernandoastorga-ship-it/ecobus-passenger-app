export default function StatusBadge({ status = "success", children }) {
  return (
    <span className={`ecobus-status-badge ecobus-status-badge--${status}`}>
      {children}
    </span>
  );
}
