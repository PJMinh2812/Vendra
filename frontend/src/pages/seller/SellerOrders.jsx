import { useEffect, useState } from 'react';
import { getShopOrders, updateSubOrderStatus } from '../../api/orders';
import DashboardTabs from '../../components/DashboardTabs';
import Pagination from '../../components/Pagination';
import { formatDate, formatPrice } from '../../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/orderStatus';
import { SELLER_TABS } from './tabs';
import './Seller.css';
import '../Orders.css';

const NEXT_ACTION = {
  pending: { label: 'Xác Nhận Đơn', nextStatus: 'Shipping' },
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  function load() {
    setLoading(true);
    getShopOrders(page).then((res) => {
      setOrders(res.items);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
  }

  useEffect(load, [page]);

  async function handleAdvance(orderId, nextStatus) {
    setUpdatingOrderId(orderId);
    try {
      await updateSubOrderStatus(orderId, nextStatus);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Kênh Người Bán</h1>
        <DashboardTabs tabs={SELLER_TABS} />

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">Chưa có đơn hàng nào.</p>
        ) : (
          <>
            {orders.map((sub) => {
              const action = NEXT_ACTION[sub.status];
              return (
                <div key={sub.orderId} className="dashboard-order-card card">
                  <div className="dashboard-order-card__header">
                    <span>Đơn hàng #{sub.orderId}</span>
                    <span style={{ color: STATUS_COLORS[sub.status] }}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </div>
                  <p className="text-muted">{formatDate(sub.createdAt)}</p>
                  {sub.items.map((item) => (
                    <div key={item.productId} className="orders-suborder__item">
                      <span className="orders-suborder__item-name">{item.productName}</span>
                      <span>x{item.quantity}</span>
                      <span className="price">{formatPrice(item.unitPrice)}</span>
                    </div>
                  ))}
                  <div className="orders-suborder__total">
                    Thành tiền: <span className="price">{formatPrice(sub.subtotal)}</span>
                  </div>
                  {action && (
                    <div className="orders-suborder__actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={updatingOrderId === sub.orderId}
                        onClick={() => handleAdvance(sub.orderId, action.nextStatus)}
                      >
                        {updatingOrderId === sub.orderId ? 'Đang cập nhật...' : action.label}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
