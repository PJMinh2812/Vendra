import { useState } from 'react';
import { createReview } from '../api/reviews';
import './ReviewForm.css';

export default function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (rating === 0) {
      setError('Vui lòng chọn số sao');
      return;
    }
    setSubmitting(true);
    try {
      await createReview(productId, { rating, comment });
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`review-form__star ${(hoverRating || rating) >= s ? 'active' : ''}`}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm (không bắt buộc)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
      </button>
    </form>
  );
}
