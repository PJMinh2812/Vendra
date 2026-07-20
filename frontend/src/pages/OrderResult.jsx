import { Link, useSearchParams } from 'react-router-dom';
import './OrderSuccess.css';

// MoMo redirect khách về đúng URL này (MoMo:RedirectUrl trong appsettings.json) sau khi
// thanh toán xong trên trang MoMo — resultCode=0 là thành công, khác 0 là thất bại/hủy.
// Đây KHÔNG phải nơi cập nhật Payment.Status thật (đó là IPN webhook, gọi server-to-server
// riêng) — trang này chỉ đọc query string để hiển thị kết quả cho người dùng.
export default function OrderResult() {
  const [searchParams] = useSearchParams();
  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');
  const success = resultCode === '0';

  return (
    <div className="skeleton-page container order-success">
      <div className="order-success__icon">{success ? '✅' : '❌'}</div>
      <h1>{success ? 'Thanh Toán Thành Công!' : 'Thanh Toán Chưa Hoàn Tất'}</h1>
      <p className="text-muted">{message || (success ? 'Đơn hàng của bạn đã được thanh toán qua MoMo.' : 'Giao dịch không thành công hoặc đã bị hủy.')}</p>
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
