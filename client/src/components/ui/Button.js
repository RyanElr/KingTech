import Link from 'next/link';

export default function Button({
  children,
  className = '',
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  loading = false,
  href,
  onClick,
  disabled,
  type = 'button',
  ...props
}) {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '1.5px' }} />
          <span>Chargement...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
