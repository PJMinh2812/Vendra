import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById, cancelSubOrder, confirmReceived } from '../api/orders';
import { formatDate, formatPrice } from '../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/orderStatus';
import OrderListSkeleton from '../components/OrderListSkeleton';
import './Orders.css';

const ITEM_PLACEHOLDER = 'https://picsum.photos/seed/vendra-order-item/80';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(undefined);
  const [cancellingShopId, setCancellingShopId] = useState(null);

  function load() {
    getOrderById(id).then(setOrder);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleCancel(shopId) {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    setCancellingShopId(shopId);
    try {
      await cancelSubOrder(id, shopId);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingShopId(null);
    }
  }

  async function handleConfirmReceived(shopId) {
    setCancellingShopId(shopId);
    try {
      await confirmReceived(id, shopId);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingShopId(null);
    }
  }

  if (order === undefined) return <div className="skeleton-page container"><OrderListSkeleton /></div>;
  if (order === null) return <div className="skeleton-page container">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="skeleton-page">
      <div className="container">
        <Link to="/orders" className="orders-back">
          ← Quay lại danh sách đơn
        </Link>
        <h1 className="orders-title">Chi Tiết Đơn Hàng {order.id}</h1>
        <p className="text-muted">Đặt lúc {formatDate(order.createdAt)}</p>
        {order.shippingAddress && <p className="text-muted">Giao tới: {order.shippingAddress}</p>}
        {order.paymentMethod && (
          <p className="text-muted">
            Thanh toán: {order.paymentMethod === 'MoMo' ? 'Ví MoMo' : 'Khi nhận hàng (COD)'} — {order.paymentStatus}
          </p>
        )}

        {order.subOrders.map((sub) => (
          <div key={sub.shopId} className="card orders-order" style={{ marginTop: 16 }}>
            <div className="orders-suborder__shop" style={{ padding: '12px 16px' }}>
              <span>🏪 {sub.shopName}</span>
              <span className="orders-suborder__status" style={{ color: STATUS_COLORS[sub.status] }}>
                {STATUS_LABELS[sub.status] ?? sub.status}
              </span>
            </div>
            {sub.items.map((item) => (
              <div key={item.productId} className="orders-suborder__item" style={{ padding: '8px 16px' }}>
                <img src={ITEM_PLACEHOLDER} alt={item.productName} />
                <span className="orders-suborder__item-name">{item.productName}</span>
                <span>x{item.quantity}</span>
                <span className="price">{formatPrice(item.unitPrice)}</span>
              </div>
            ))}
            <div className="orders-suborder__total" style={{ padding: '12px 16px' }}>
              Thành tiền: <span className="price">{formatPrice(sub.subtotal)}</span>
            </div>
            {sub.status === 'pending' && (
              <div className="orders-suborder__actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={cancellingShopId === sub.shopId}
                  onClick={() => handleCancel(sub.shopId)}
                >
                  {cancellingShopId === sub.shopId ? 'Đang hủy...' : 'Hủy Đơn'}
                </button>
              </div>
            )}
            {sub.status === 'shipping' && (
              <div className="orders-suborder__actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={cancellingShopId === sub.shopId}
                  onClick={() => handleConfirmReceived(sub.shopId)}
                >
                  {cancellingShopId === sub.shopId ? 'Đang xác nhận...' : 'Đã Nhận Được Hàng'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
