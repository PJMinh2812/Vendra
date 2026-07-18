import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getShopById } from '../mock/data';
import { createOrder } from '../api/orders';
import { formatPrice } from '../utils/format';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { selectedItems, selectedTotal, clearSelected } = useCart();
  const [address, setAddress] = useState('123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  if (selectedItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const groupedByShop = selectedItems.reduce((groups, item) => {
    const key = item.product.shopId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  async function handlePlaceOrder() {
    setSubmitting(true);
    const payload = Object.entries(groupedByShop).map(([shopId, items]) => ({
      shopId,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.product.price })),
    }));
    const order = await createOrder(payload);
    clearSelected();
    navigate(`/order-success/${order.id}`);
  }

  return (
    <div className="skeleton-page">
      <div className="container checkout-layout">
        <div className="checkout-main">
          <div className="checkout-address card">
            <h2>Địa Chỉ Nhận Hàng</h2>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          </div>

          {Object.entries(groupedByShop).map(([shopId, items]) => {
            const shop = getShopById(shopId);
            const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
            return (
              <div key={shopId} className="checkout-shop-group card">
                <div className="checkout-shop-group__header">🏪 {shop?.name ?? shopId}</div>
                {items.map((item) => (
                  <div key={item.productId} className="checkout-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <span className="checkout-item__name">{item.product.name}</span>
                    <span>x{item.quantity}</span>
                    <span className="price">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="checkout-shop-group__subtotal">
                  Tổng cộng ({items.length} sản phẩm): <span className="price">{formatPrice(subtotal)}</span>
                </div>
              </div>
            );
          })}

          <div className="checkout-payment card">
            <h2>Phương Thức Thanh Toán</h2>
            <label>
              <input
                type="radio"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Thẻ tín dụng / Ghi nợ
            </label>
          </div>
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
