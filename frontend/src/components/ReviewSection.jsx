import { useEffect, useState } from 'react';
import Rating from './Rating';
import { getProductReviews } from '../api/reviews';
import { formatDate } from '../utils/format';
import './ReviewSection.css';

// Chỉ hiển thị đánh giá đã có — viết đánh giá chỉ thực hiện được từ trang "Đơn Mua"
// (đơn đã giao), không cho viết trực tiếp ở đây.
export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductReviews(productId).then((list) => {
      setReviews(list);
      setLoading(false);
    });
  }, [productId]);

  return (
    <div className="review-section card">
      <h2>Đánh Giá Sản Phẩm</h2>

      {loading ? (
        <p className="text-muted">Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item__header">
                <span className="review-item__name">{r.reviewerName}</span>
                <span className="text-muted">{formatDate(r.createdAt)}</span>
              </div>
              <Rating value={r.rating} size={13} />
              {r.comment && <p className="review-item__comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
