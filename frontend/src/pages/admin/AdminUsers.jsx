import { useEffect, useState } from 'react';
import { getAllUsers, lockUser, unlockUser } from '../../api/users';
import DashboardTabs from '../../components/DashboardTabs';
import { ADMIN_TABS } from './tabs';
import '../seller/Seller.css';

const ROLE_LABELS = { Customer: 'Khách hàng', Seller: 'Người bán', Admin: 'Quản trị' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    getAllUsers().then((list) => {
      setUsers(list);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleToggleLock(user) {
    setError('');
    setBusyId(user.id);
    try {
      if (user.lockedOut) {
        await unlockUser(user.id);
      } else {
        await lockUser(user.id);
      }
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Quản Trị</h1>
        <DashboardTabs tabs={ADMIN_TABS} />

        {error && <p className="auth-error">{error}</p>}

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : users.length === 0 ? (
          <p className="text-muted">Chưa có người dùng nào.</p>
        ) : (
          <table className="dashboard-table card">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                  <td>{u.lockedOut ? '🔒 Đã khóa' : 'Hoạt động'}</td>
                  <td>
                    {u.role !== 'Admin' && (
                      <button
                        type="button"
                        className="header__link-btn"
                        disabled={busyId === u.id}
                        onClick={() => handleToggleLock(u)}
                      >
                        {u.lockedOut ? 'Mở khóa' : 'Khóa'}
                      </button>
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
