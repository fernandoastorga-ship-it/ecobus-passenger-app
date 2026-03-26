export default function PrimaryButton({
  children,
  type = "button",
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className="ecobus-button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
