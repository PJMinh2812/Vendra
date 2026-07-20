import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyShop, registerShop } from '../../api/shops';
import DashboardTabs from '../../components/DashboardTabs';
import { SELLER_TABS } from './tabs';
import './Seller.css';

const STATUS_LABEL = {
  Pending: 'Đang chờ duyệt',
  Approved: 'Đã duyệt',
  Rejected: 'Đã bị từ chối',
};

export default function SellerShop() {
  const [shop, setShop] = useState(undefined);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyShop().then(setShop);
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const created = await registerShop({ name, description });
      setShop(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Kênh Người Bán</h1>
        <DashboardTabs tabs={SELLER_TABS} />

        {shop === undefined && <p className="text-muted">Đang tải...</p>}

        {shop === null && (
          <form className="dashboard-form card" onSubmit={handleRegister}>
            <p className="text-muted">Bạn chưa có shop — đăng ký để bắt đầu bán hàng.</p>
            <label>
              Tên shop
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Mô tả
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Đăng Ký Shop'}
            </button>
          </form>
        )}

        {shop && (
          <div className="shop-status-card card">
            <span className={`shop-status-badge shop-status-badge--${shop.status.toLowerCase()}`}>
              {STATUS_LABEL[shop.status] ?? shop.status}
            </span>
            <h2>{shop.name}</h2>
            {shop.description && <p className="text-muted">{shop.description}</p>}

            {shop.status === 'Pending' && (
              <p className="text-muted">Shop của bạn đang chờ Admin duyệt — quay lại sau nhé.</p>
            )}
            {shop.status === 'Rejected' && (
              <p className="text-muted">Shop của bạn đã bị từ chối. Liên hệ Admin để biết thêm chi tiết.</p>
            )}
            {shop.status === 'Approved' && (
              <p>
                <Link to="/seller/products" className="btn btn-primary">
                  Quản Lý Sản Phẩm
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
