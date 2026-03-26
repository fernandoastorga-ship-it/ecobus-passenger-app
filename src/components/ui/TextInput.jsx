export default function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  name,
  maxLength,
}) {
  return (
    <div className="ecobus-field">
      {label && <label className="ecobus-label">{label}</label>}
      <input
        className="ecobus-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        name={name}
        maxLength={maxLength}
      />
    </div>
  );
}
