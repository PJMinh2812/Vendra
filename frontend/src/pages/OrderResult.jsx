import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { reconcileMoMoPayment } from '../api/orders';
import './OrderSuccess.css';

// MoMo redirect khách về đúng URL này (MoMo:RedirectUrl trong appsettings.json) sau khi thanh
// toán xong. Thay vì chỉ đọc resultCode trên query (không đáng tin vì có thể bị sửa), ta gọi
// backend hỏi thẳng MoMo trạng thái thật rồi cập nhật Payment.Status — không phụ thuộc IPN gọi
// ngược vào máy (vốn cần tunnel công khai). IPN vẫn chạy song song như một lớp dự phòng.
export default function OrderResult() {
  const [searchParams] = useSearchParams();
  const momoOrderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!momoOrderId) {
      setStatus('unknown');
      return;
    }
    reconcileMoMoPayment(momoOrderId)
      .then((s) => setStatus(s))
      .catch(() => setStatus('unknown'));
  }, [momoOrderId]);

  if (status === 'checking') {
    return (
      <div className="skeleton-page container order-success">
        <div className="order-success__icon">⏳</div>
        <h1>Đang xác nhận thanh toán…</h1>
        <p className="text-muted">Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  const success = status === 'Paid';

  return (
    <div className="skeleton-page container order-success">
      <div className="order-success__icon">{success ? '✅' : '❌'}</div>
      <h1>{success ? 'Thanh Toán Thành Công!' : 'Thanh Toán Chưa Hoàn Tất'}</h1>
      <p className="text-muted">
        {success
          ? 'Đơn hàng của bạn đã được thanh toán qua MoMo.'
          : message || 'Giao dịch không thành công hoặc đã bị hủy.'}
      </p>
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
