export default function OrderListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[0, 1].map((i) => (
        <div key={i} className="card" style={{ padding: 16 }}>
          <div className="sk sk-line" style={{ width: '30%', marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <div className="sk" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)' }} />
            <div className="sk sk-line" style={{ flex: 1 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
