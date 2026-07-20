import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/dashboard';
import DashboardTabs from '../../components/DashboardTabs';
import { formatPrice } from '../../utils/format';
import { ADMIN_TABS } from './tabs';
import '../seller/Seller.css';
import './AdminDashboard.css';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Quản Trị</h1>
        <DashboardTabs tabs={ADMIN_TABS} />

        {loading || !stats ? (
          <p className="text-muted">Đang tải...</p>
        ) : (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Tổng doanh thu</span>
                <span className="admin-stat-card__value">{formatPrice(stats.totalRevenue)}</span>
              </div>
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Tổng đơn hàng</span>
                <span className="admin-stat-card__value">{stats.totalOrders}</span>
              </div>
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Đơn hôm nay</span>
                <span className="admin-stat-card__value">{stats.ordersToday}</span>
              </div>
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Shop chờ duyệt</span>
                <span className="admin-stat-card__value">{stats.pendingShops}</span>
              </div>
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Sản phẩm</span>
                <span className="admin-stat-card__value">{stats.totalProducts}</span>
              </div>
              <div className="admin-stat-card card">
                <span className="admin-stat-card__label">Người dùng</span>
                <span className="admin-stat-card__value">{stats.totalUsers}</span>
              </div>
            </div>

            <div className="admin-chart card">
              <p className="admin-chart__title">Doanh thu 7 ngày gần nhất</p>
              <RevenueChart data={stats.revenueLast7Days} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RevenueChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.amount));

  return (
    <div className="admin-chart__bars">
      {data.map((d) => (
        <div key={d.date} className="admin-chart__bar-col">
          <span className="admin-chart__bar-value">{d.amount > 0 ? formatPrice(d.amount) : ''}</span>
          <div className="admin-chart__bar" style={{ height: `${Math.max(4, (d.amount / max) * 100)}px` }} />
          <span className="admin-chart__bar-label">{WEEKDAY_LABELS[new Date(d.date).getDay()]}</span>
        </div>
      ))}
    </div>
  );
}
