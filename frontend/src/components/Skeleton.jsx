export function ProductCardSkeleton() {
  return (
    <div className="card sk-card">
      <div className="sk sk-card__image" />
      <div className="sk-card__body">
        <div className="sk sk-line" style={{ width: '100%' }} />
        <div className="sk sk-line" style={{ width: '60%' }} />
        <div className="sk sk-line" style={{ width: '40%', height: 16 }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
