import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { addCartItem } from '../api/cart';
import { formatPrice } from '../utils/format';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedItems, selectedTotal, clearSelected } = useCart();
  const [address, setAddress] = useState('123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Checkout thật yêu cầu đăng nhập (backend: POST /api/orders chỉ cho role Customer) —
  // giỏ hàng vẫn duyệt/thêm được khi chưa đăng nhập, chỉ chặn ở bước đặt hàng.
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user || selectedItems.length === 0) {
    if (user && selectedItems.length === 0) navigate('/cart');
    return null;
  }

  const groupedByShop = selectedItems.reduce((groups, item) => {
    const key = item.product.shopId;
    if (!groups[key]) groups[key] = { shopName: item.product.shopName, items: [] };
    groups[key].items.push(item);
    return groups;
  }, {});

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError('');
    try {
      // Giỏ hàng ở frontend giữ local (localStorage) để duyệt ẩn danh, nhưng backend tạo đơn
      // từ đúng CartItems đã lưu của user trên server — nên phải đồng bộ giỏ local lên server
      // ngay trước khi gọi checkout.
      for (const item of selectedItems) {
        await addCartItem(item.productId, item.quantity);
      }

      const order = await createOrder({ shippingAddress: address, paymentMethod });
      clearSelected();

      if (order.paymentMethod === 'MoMo' && order.payUrl) {
        window.location.href = order.payUrl;
        return;
      }

      navigate(`/order-success/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="skeleton-page">
      <div className="container checkout-layout">
        <div className="checkout-main">
          <div className="checkout-address card">
            <h2>Địa Chỉ Nhận Hàng</h2>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          </div>

          {Object.entries(groupedByShop).map(([shopId, group]) => {
            const subtotal = group.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
            return (
              <div key={shopId} className="checkout-shop-group card">
                <div className="checkout-shop-group__header">🏪 {group.shopName ?? shopId}</div>
                {group.items.map((item) => (
                  <div key={item.productId} className="checkout-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <span className="checkout-item__name">{item.product.name}</span>
                    <span>x{item.quantity}</span>
                    <span className="price">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="checkout-shop-group__subtotal">
                  Tổng cộng ({group.items.length} sản phẩm): <span className="price">{formatPrice(subtotal)}</span>
                </div>
              </div>
            );
          })}

          <div className="checkout-payment card">
            <h2>Phương Thức Thanh Toán</h2>
            <label>
              <input
                type="radio"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input
                type="radio"
                checked={paymentMethod === 'MoMo'}
                onChange={() => setPaymentMethod('MoMo')}
              />
              Ví MoMo
            </label>
          </div>
          {error && <p className="auth-error">{error}</p>}
        </div>

        <div className="checkout-sidebar card">
          <div className="checkout-sidebar__row">
            <span>Tạm tính</span>
            <span>{formatPrice(selectedTotal)}</span>
          </div>
          <div className="checkout-sidebar__row">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div className="checkout-sidebar__row checkout-sidebar__row--total">
            <span>Tổng thanh toán</span>
            <span className="price">{formatPrice(selectedTotal)}</span>
          </div>
          <button className="btn btn-primary checkout-sidebar__submit" onClick={handlePlaceOrder} disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
