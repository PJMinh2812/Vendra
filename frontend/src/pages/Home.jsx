import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import { ProductGridSkeleton } from '../components/Skeleton';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ pageSize: 100 })]).then(([cats, prods]) => {
      setCategories(cats);
      const shuffled = [...prods.items].sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 20));
      setLoading(false);
    });
  }, []);

  return (
    <div className="skeleton-page">
      <div className="container">
        <BannerCarousel />

        <section className="home-categories card">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="home-categories__item">
              <span className="home-categories__icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </section>

        <section className="home-section">
          <h2 className="home-section__title">Gợi Ý Hôm Nay</h2>
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
