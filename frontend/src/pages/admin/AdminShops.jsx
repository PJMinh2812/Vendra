import { useEffect, useState } from 'react';
import { getAllShops, approveShop, rejectShop } from '../../api/shops';
import DashboardTabs from '../../components/DashboardTabs';
import { formatDate } from '../../utils/format';
import { ADMIN_TABS } from './tabs';
import '../seller/Seller.css';

const STATUS_FILTERS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ duyệt' },
  { key: 'Approved', label: 'Đã duyệt' },
  { key: 'Rejected', label: 'Đã từ chối' },
];

export default function AdminShops() {
  const [status, setStatus] = useState('Pending');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getAllShops(status || undefined).then((list) => {
      setShops(list);
      setLoading(false);
    });
  }

  useEffect(load, [status]);

  async function handleApprove(id) {
    await approveShop(id);
    load();
  }

  async function handleReject(id) {
    if (!window.confirm('Từ chối shop này?')) return;
    await rejectShop(id);
    load();
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Quản Trị</h1>
        <DashboardTabs tabs={ADMIN_TABS} />

        <div className="dashboard-filter-tabs">
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} className={status === f.key ? 'active' : ''} onClick={() => setStatus(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : shops.length === 0 ? (
          <p className="text-muted">Không có shop nào.</p>
        ) : (
          <table className="dashboard-table card">
            <thead>
              <tr>
                <th>Tên shop</th>
                <th>Mô tả</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td>{s.status}</td>
                  <td>
                    {s.status === 'Pending' && (
                      <>
                        <button type="button" className="header__link-btn" onClick={() => handleApprove(s.id)}>
                          Duyệt
                        </button>
                        {' · '}
                        <button type="button" className="header__link-btn" onClick={() => handleReject(s.id)}>
                          Từ chối
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
