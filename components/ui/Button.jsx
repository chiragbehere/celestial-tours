'use client';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'icon'
  className = '',
  loading = false,
  disabled = false,
  icon,
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="typing-dot" style={{ width: 6, height: 6, background: 'currentColor' }} />
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {icon && <span className="btn-icon-prefix">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
