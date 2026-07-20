import { apiFetch } from './client';

// Chỉ dùng ở luồng checkout thật (đồng bộ giỏ hàng local lên giỏ hàng server ngay trước khi
// đặt đơn) — không dùng cho việc hiển thị giỏ hàng hằng ngày, vì giỏ hàng UI vẫn giữ local
// (localStorage) để khách duyệt/thêm giỏ mà không cần đăng nhập.

export async function addCartItem(productId, quantity) {
  return apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId: Number(productId), quantity }),
  });
}
