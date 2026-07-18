import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import './Search.css';

export default function Search() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('popular');
  const [priceFilter, setPriceFilter] = useState(null); // { min, max } | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search: query, categoryId, sort, pageSize: 40 }).then((res) => {
      let items = res.items;
      if (priceFilter) {
        items = items.filter((p) => p.price >= priceFilter.min && p.price <= priceFilter.max);
      }
      setProducts(items);
      setTotal(items.length);
      setLoading(false);
    });
  }, [query, categoryId, sort, priceFilter]);

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="skeleton-page">
      <div className="container search-layout">
        <aside className="search-sidebar card">
          <h3>Danh Mục</h3>
          <ul className="search-sidebar__categories">
            <li>
              <Link to="/search" className={!categoryId ? 'active' : ''}>
                Tất cả
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.id}`} className={c.id === categoryId ? 'active' : ''}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3>Khoảng Giá</h3>
          <div className="search-sidebar__prices">
            <button className={!priceFilter ? 'active' : ''} onClick={() => setPriceFilter(null)}>
              Tất cả
            </button>
            <button
              className={priceFilter?.max === 200000 ? 'active' : ''}
              onClick={() => setPriceFilter({ min: 0, max: 200000 })}
            >
              Dưới 200.000₫
            </button>
            <button
              className={priceFilter?.min === 200000 ? 'active' : ''}
              onClick={() => setPriceFilter({ min: 200000, max: 1000000 })}
            >
              200.000₫ - 1.000.000₫
            </button>
            <button
              className={priceFilter?.min === 1000000 ? 'active' : ''}
              onClick={() => setPriceFilter({ min: 1000000, max: Infinity })}
            >
              Trên 1.000.000₫
            </button>
          </div>
        </aside>

        <div className="search-content">
          <div className="search-toolbar card">
            <span>
              {query
                ? `Kết quả tìm kiếm cho "${query}"`
                : activeCategory
                ? activeCategory.name
                : 'Tất cả sản phẩm'}{' '}
              ({total})
            </span>
            <div className="search-toolbar__sort">
              <span>Sắp xếp theo</span>
              {[
                { key: 'popular', label: 'Phổ biến' },
                { key: 'newest', label: 'Mới nhất' },
                { key: 'price-asc', label: 'Giá tăng dần' },
                { key: 'price-desc', label: 'Giá giảm dần' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={sort === opt.key ? 'active' : ''}
                  onClick={() => setSort(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <p className="text-muted">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
