import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import DashboardTabs from '../../components/DashboardTabs';
import { ADMIN_TABS } from './tabs';
import '../seller/Seller.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  function load() {
    setLoading(true);
    getCategories().then((list) => {
      setCategories(list);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await createCategory(newName.trim());
      setNewName('');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  async function handleSaveEdit(id) {
    if (!editingName.trim()) return;
    setError('');
    try {
      await updateCategory(id, editingName.trim());
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa danh mục này?')) return;
    setError('');
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Quản Trị</h1>
        <DashboardTabs tabs={ADMIN_TABS} />

        <form className="dashboard-form card" onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <label>
            Thêm danh mục mới
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tên danh mục"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Đang thêm...' : 'Thêm Danh Mục'}
          </button>
        </form>

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : categories.length === 0 ? (
          <p className="text-muted">Chưa có danh mục nào.</p>
        ) : (
          <table className="dashboard-table card">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editingId === c.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <>
                        {c.icon} {c.name}
                      </>
                    )}
                  </td>
                  <td>
                    {editingId === c.id ? (
                      <>
                        <button type="button" className="header__link-btn" onClick={() => handleSaveEdit(c.id)}>
                          Lưu
                        </button>
                        {' · '}
                        <button type="button" className="header__link-btn" onClick={() => setEditingId(null)}>
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="header__link-btn" onClick={() => startEdit(c)}>
                          Sửa
                        </button>
                        {' · '}
                        <button type="button" className="header__link-btn" onClick={() => handleDelete(c.id)}>
                          Xóa
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
