import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import { getProductById, getShopById } from '../mock/data';
import { formatDate, formatPrice } from '../utils/format';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/orderStatus';
import OrderListSkeleton from '../components/OrderListSkeleton';
import './Orders.css';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    getOrderById(id).then(setOrder);
  }, [id]);

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

        {order.subOrders.map((sub) => {
          const shop = getShopById(sub.shopId);
          const subtotal = sub.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
          return (
            <div key={sub.id} className="card orders-order" style={{ marginTop: 16 }}>
              <div className="orders-suborder__shop" style={{ padding: '12px 16px' }}>
                <span>🏪 {shop?.name ?? sub.shopId}</span>
                <span className="orders-suborder__status" style={{ color: STATUS_COLORS[sub.status] }}>
                  {STATUS_LABELS[sub.status]}
                </span>
              </div>
              {sub.items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="orders-suborder__item" style={{ padding: '8px 16px' }}>
                    <img src={product.image} alt={product.name} />
                    <span className="orders-suborder__item-name">{product.name}</span>
                    <span>x{item.quantity}</span>
                    <span className="price">{formatPrice(item.unitPrice)}</span>
                  </div>
                );
              })}
              <div className="orders-suborder__total" style={{ padding: '12px 16px' }}>
                Thành tiền: <span className="price">{formatPrice(subtotal)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
