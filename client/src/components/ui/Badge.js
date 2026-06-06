export default function Badge({
  children,
  variant = 'primary', // primary, accent, success, warning, error, sale
  className = '',
  ...props
}) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
