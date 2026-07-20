export default function Rating({ value, size = 12 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {stars.map((s) => {
        const filled = value >= s;
        const half = !filled && value >= s - 0.5;
        return (
          <span
            key={s}
            style={{
              fontSize: size,
              color: filled || half ? 'var(--color-rating)' : '#d5d5d5',
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}
