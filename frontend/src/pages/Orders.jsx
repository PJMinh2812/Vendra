import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelSubOrder, confirmReceived } from '../api/orders';
import { formatDate, formatPrice } from '../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/orderStatus';
import OrderListSkeleton from '../components/OrderListSkeleton';
import './Orders.css';

const ITEM_PLACEHOLDER = 'https://picsum.photos/seed/vendra-order-item/80';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingKey, setCancellingKey] = useState(null);

  function load() {
    setLoading(true);
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(orderId, shopId) {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    setCancellingKey(`${orderId}-${shopId}`);
    try {
      await cancelSubOrder(orderId, shopId);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingKey(null);
    }
  }

  async function handleConfirmReceived(orderId, shopId) {
    setCancellingKey(`${orderId}-${shopId}`);
    try {
      await confirmReceived(orderId, shopId);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingKey(null);
    }
  }

  if (loading) return <div className="skeleton-page container"><OrderListSkeleton /></div>;

  if (orders.length === 0) {
    return (
      <div className="skeleton-page container orders-empty">
        <p>📦 Bạn chưa có đơn hàng nào</p>
        <Link to="/" className="btn btn-primary">
          Mua Sắm Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="skeleton-page">
      <div className="container">
        <h1 className="orders-title">Đơn Mua</h1>
        {orders.map((order) => (
          <div key={order.id} className="card orders-order">
            <div className="orders-order__header">
              <span>Đơn hàng {order.id}</span>
              <span className="text-muted">{formatDate(order.createdAt)}</span>
            </div>
            {order.subOrders.map((sub) => (
              <div key={sub.shopId} className="orders-suborder-block">
                <Link to={`/orders/${order.id}`} className="orders-suborder">
                  <div className="orders-suborder__shop">
                    <span>🏪 {sub.shopName}</span>
                    <span
                      className="orders-suborder__status"
                      style={{ color: STATUS_COLORS[sub.status] }}
                    >
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </div>
                  {sub.items.map((item) => (
                    <div key={item.productId} className="orders-suborder__item">
                      <img src={ITEM_PLACEHOLDER} alt={item.productName} />
                      <span className="orders-suborder__item-name">{item.productName}</span>
                      <span>x{item.quantity}</span>
                      <span className="price">{formatPrice(item.unitPrice)}</span>
                    </div>
                  ))}
                  <div className="orders-suborder__total">
                    Thành tiền: <span className="price">{formatPrice(sub.subtotal)}</span>
                  </div>
                </Link>
                {sub.status === 'pending' && (
                  <div className="orders-suborder__actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={cancellingKey === `${order.id}-${sub.shopId}`}
                      onClick={() => handleCancel(order.id, sub.shopId)}
                    >
                      {cancellingKey === `${order.id}-${sub.shopId}` ? 'Đang hủy...' : 'Hủy Đơn'}
                    </button>
                  </div>
                )}
                {sub.status === 'shipping' && (
                  <div className="orders-suborder__actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={cancellingKey === `${order.id}-${sub.shopId}`}
                      onClick={() => handleConfirmReceived(order.id, sub.shopId)}
                    >
                      {cancellingKey === `${order.id}-${sub.shopId}` ? 'Đang xác nhận...' : 'Đã Nhận Được Hàng'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
