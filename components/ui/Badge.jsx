export default function Badge({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'amber' | 'success' | 'warning' | 'error' | 'glass'
  className = '',
  icon
}) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
