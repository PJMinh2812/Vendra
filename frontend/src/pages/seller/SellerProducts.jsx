import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyShop } from '../../api/shops';
import { getProducts, deleteProduct } from '../../api/products';
import DashboardTabs from '../../components/DashboardTabs';
import { formatPrice } from '../../utils/format';
import { SELLER_TABS } from './tabs';
import './Seller.css';

export default function SellerProducts() {
  const [shop, setShop] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadProducts(shopId) {
    setLoading(true);
    getProducts({ shopId, pageSize: 100 }).then((res) => {
      setProducts(res.items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getMyShop().then((s) => {
      setShop(s);
      if (s?.status === 'Approved') loadProducts(s.id);
      else setLoading(false);
    });
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    await deleteProduct(id);
    loadProducts(shop.id);
  }

  return (
    <div className="skeleton-page dashboard-page">
      <div className="container">
        <h1>Kênh Người Bán</h1>
        <DashboardTabs tabs={SELLER_TABS} />

        {shop === undefined || loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : shop?.status !== 'Approved' ? (
          <p className="text-muted">
            Shop của bạn chưa được duyệt — xem trạng thái ở tab{' '}
            <Link to="/seller">Shop Của Tôi</Link>.
          </p>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
              <Link to="/seller/products/new" className="btn btn-primary">
                + Thêm Sản Phẩm
              </Link>
            </div>
            {products.length === 0 ? (
              <p className="text-muted" style={{ padding: '0 16px 16px' }}>
                Bạn chưa có sản phẩm nào.
              </p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img src={p.image} alt={p.name} />
                      </td>
                      <td>{p.name}</td>
                      <td>{formatPrice(p.price)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <Link to={`/seller/products/${p.id}/edit`}>Sửa</Link>
                        {' · '}
                        <button type="button" className="header__link-btn" onClick={() => handleDelete(p.id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
