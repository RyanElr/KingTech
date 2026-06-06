export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
