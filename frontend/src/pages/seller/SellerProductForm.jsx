import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../api/categories';
import { getProductById, createProduct, updateProduct } from '../../api/products';
import DashboardTabs from '../../components/DashboardTabs';
import { SELLER_TABS } from './tabs';
import './Seller.css';

export default function SellerProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getProductById(id).then((p) => {
      if (p) {
        setCategoryId(p.categoryId);
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setStock(p.stock);
        setImageUrl(p.image);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const dto = {
      categoryId: Number(categoryId),
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || null,
    };
    try {
      if (isEdit) {
        await updateProduct(id, dto);
      } else {
        await createProduct(dto);
      }
      navigate('/seller/products');
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

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : (
          <form className="dashboard-form card" onSubmit={handleSubmit}>
            <h2>{isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
            <label>
              Danh mục
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="" disabled>
                  Chọn danh mục
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tên sản phẩm
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Mô tả
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </label>
            <label>
              Giá (₫)
              <input type="number" min="0.01" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label>
              Tồn kho
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </label>
            <label>
              Link ảnh (URL)
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang lưu...' : isEdit ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
