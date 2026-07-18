import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import { getProductById, getShopById } from '../mock/data';
import { formatDate, formatPrice } from '../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/orderStatus';
import OrderListSkeleton from '../components/OrderListSkeleton';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

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
            {order.subOrders.map((sub) => {
              const shop = getShopById(sub.shopId);
              const subtotal = sub.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
              return (
                <Link key={sub.id} to={`/orders/${order.id}`} className="orders-suborder">
                  <div className="orders-suborder__shop">
                    <span>🏪 {shop?.name ?? sub.shopId}</span>
                    <span
                      className="orders-suborder__status"
                      style={{ color: STATUS_COLORS[sub.status] }}
                    >
                      {STATUS_LABELS[sub.status]}
                    </span>
                  </div>
                  {sub.items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="orders-suborder__item">
                        <img src={product.image} alt={product.name} />
                        <span className="orders-suborder__item-name">{product.name}</span>
                        <span>x{item.quantity}</span>
                        <span className="price">{formatPrice(item.unitPrice)}</span>
                      </div>
                    );
                  })}
                  <div className="orders-suborder__total">
                    Thành tiền: <span className="price">{formatPrice(subtotal)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
