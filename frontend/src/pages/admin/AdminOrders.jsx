import { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orders';
import DashboardTabs from '../../components/DashboardTabs';
import Pagination from '../../components/Pagination';
import { formatDate, formatPrice } from '../../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/orderStatus';
import { ADMIN_TABS } from './tabs';
import '../seller/Seller.css';
import '../Orders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllOrders(page).then((res) => {
      setOrders(res.items);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
  }, [page]);

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Quản Trị</h1>
        <DashboardTabs tabs={ADMIN_TABS} />

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">Chưa có đơn hàng nào.</p>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order.id} className="dashboard-order-card card">
                <div className="dashboard-order-card__header">
                  <span>Đơn hàng #{order.id}</span>
                  <span className="text-muted">{formatDate(order.createdAt)}</span>
                </div>
                <p className="text-muted">
                  {order.paymentMethod === 'MoMo' ? 'Ví MoMo' : 'COD'} — {order.paymentStatus} — Tổng{' '}
                  {formatPrice(order.totalAmount)}
                </p>
                {order.subOrders.map((sub) => (
                  <div key={sub.shopId} style={{ marginTop: 8 }}>
                    <div className="orders-suborder__shop">
                      <span>🏪 {sub.shopName}</span>
                      <span style={{ color: STATUS_COLORS[sub.status] }}>
                        {STATUS_LABELS[sub.status] ?? sub.status}
                      </span>
                    </div>
                    {sub.items.map((item) => (
                      <div key={item.productId} className="orders-suborder__item">
                        <span className="orders-suborder__item-name">{item.productName}</span>
                        <span>x{item.quantity}</span>
                        <span className="price">{formatPrice(item.unitPrice)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
