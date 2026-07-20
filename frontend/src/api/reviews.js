import { apiFetch } from './client';

function adaptReview(dto) {
  return {
    id: dto.id,
    reviewerName: dto.reviewerName,
    rating: dto.rating,
    comment: dto.comment,
    createdAt: dto.createdAt,
  };
}

export async function getProductReviews(productId) {
  const list = await apiFetch(`/products/${productId}/reviews`);
  return list.map(adaptReview);
}

export async function canReviewProduct(productId) {
  const res = await apiFetch(`/products/${productId}/reviews/can-review`);
  return res.canReview;
}

export async function createReview(productId, { rating, comment }) {
  const created = await apiFetch(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment: comment || null }),
  });
  return adaptReview(created);
}
