export default function Card({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`glass-card ${hoverable ? '' : 'no-hover'} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}
