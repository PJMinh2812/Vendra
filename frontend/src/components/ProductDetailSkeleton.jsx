export default function ProductDetailSkeleton() {
  return (
    <div className="container">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, padding: 24 }}>
        <div className="sk" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sk sk-line" style={{ width: '80%', height: 22 }} />
          <div className="sk sk-line" style={{ width: '40%' }} />
          <div className="sk" style={{ height: 72, borderRadius: 'var(--radius-sm)', marginTop: 8 }} />
          <div className="sk sk-line" style={{ width: '30%', marginTop: 16 }} />
          <div className="sk" style={{ width: 160, height: 44, borderRadius: 'var(--radius-pill)', marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
}
