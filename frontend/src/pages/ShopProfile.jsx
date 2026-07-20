import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById } from '../api/shops';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import './ShopProfile.css';

export default function ShopProfile() {
  const { id } = useParams();
  const [shop, setShop] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getShopById(id).then((s) => {
      setShop(s);
      if (!s) {
        setLoading(false);
        return;
      }
      getProducts({ shopId: id, pageSize: 40 }).then((res) => {
        setProducts(res.items);
        setLoading(false);
      });
    });
  }, [id]);

  if (shop === undefined && loading) return <div className="skeleton-page container"><ProductGridSkeleton count={8} /></div>;
  if (!shop) return <div className="skeleton-page container">Không tìm thấy shop.</div>;

  return (
    <div className="skeleton-page">
      <div className="container">
        <div className="shop-profile__header card">
          <img src={shop.avatar} alt={shop.name} />
          <div>
            <h1>{shop.name}</h1>
            {shop.description && <p className="text-muted">{shop.description}</p>}
          </div>
        </div>

        <h2 className="shop-profile__section-title">Sản Phẩm Của Shop</h2>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <p className="text-muted">Shop chưa có sản phẩm nào.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
