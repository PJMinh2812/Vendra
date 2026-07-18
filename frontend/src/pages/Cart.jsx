import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getShopById } from '../mock/data';
import QuantityInput from '../components/QuantityInput';
import { formatPrice } from '../utils/format';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { items, groupedByShop, selectedItems, selectedTotal, updateQuantity, removeItem, toggleSelected } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="skeleton-page container cart-empty">
        <p>🛒 Giỏ hàng của bạn đang trống</p>
        <Link to="/" className="btn btn-primary">
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="skeleton-page">
      <div className="container">
        <h1 className="cart-title">Giỏ Hàng</h1>

        {Object.entries(groupedByShop).map(([shopId, shopItems]) => {
          const shop = getShopById(shopId);
          return (
            <div key={shopId} className="cart-shop-group card">
              <div className="cart-shop-group__header">
                <span>🏪 {shop?.name ?? shopId}</span>
              </div>
              {shopItems.map((item) => (
                <div key={item.productId} className="cart-item">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelected(item.productId)}
                  />
                  <img src={item.product.image} alt={item.product.name} />
                  <span className="cart-item__name">{item.product.name}</span>
                  <span className="price">{formatPrice(item.product.price)}</span>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.productId, q)}
                    max={item.product.stock}
                  />
                  <span className="cart-item__subtotal price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(item.productId)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          );
        })}

        <div className="cart-summary card">
          <span>
            Đã chọn <strong>{selectedItems.length}</strong> sản phẩm
          </span>
          <div className="cart-summary__total">
            <span>Tổng thanh toán:</span>
            <span className="price cart-summary__total-value">{formatPrice(selectedTotal)}</span>
            <button
              className="btn btn-primary"
              disabled={selectedItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Mua Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
