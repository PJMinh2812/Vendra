import { Link, useParams } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="skeleton-page container order-success">
      <div className="order-success__icon">✅</div>
      <h1>Đặt Hàng Thành Công!</h1>
      <p className="text-muted">Mã đơn hàng: {id}</p>
      <div className="order-success__actions">
        <Link to="/orders" className="btn btn-outline">
          Xem Đơn Hàng
        </Link>
        <Link to="/" className="btn btn-primary">
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    </div>
  );
}
