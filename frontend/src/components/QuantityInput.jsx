import './QuantityInput.css';

export default function QuantityInput({ value, onChange, min = 1, max = 999 }) {
  function clamp(v) {
    return Math.min(max, Math.max(min, v));
  }

  return (
    <div className="quantity-input">
      <button type="button" onClick={() => onChange(clamp(value - 1))} disabled={value <= min}>
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(clamp(n));
        }}
      />
      <button type="button" onClick={() => onChange(clamp(value + 1))} disabled={value >= max}>
        +
      </button>
    </div>
  );
}
