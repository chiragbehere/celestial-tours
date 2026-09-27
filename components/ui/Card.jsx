export default function Card({
  children,
  className = '',
  flat = false,
  onClick,
  ...props
}) {
  const cardClass = flat ? 'card-flat' : 'card';
  return (
    <div
      className={`${cardClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
