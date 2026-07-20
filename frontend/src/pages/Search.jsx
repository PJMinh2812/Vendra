import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { ProductGridSkeleton } from '../components/Skeleton';
import './Search.css';

const PAGE_SIZE = 20;

export default function Search() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('popular');
  const [priceFilter, setPriceFilter] = useState(null); // { min, max } | null
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Đổi bộ lọc/từ khóa/sắp xếp thì luôn quay về trang 1 — tránh kẹt ở trang 5 của kết quả cũ.
  useEffect(() => {
    setPage(1);
  }, [query, categoryId, sort, priceFilter]);

  useEffect(() => {
    setLoading(true);
    getProducts({
      search: query,
      categoryId,
      sort,
      page,
      pageSize: PAGE_SIZE,
      minPrice: priceFilter?.min ?? null,
      maxPrice: priceFilter && Number.isFinite(priceFilter.max) ? priceFilter.max : null,
    }).then((res) => {
      setProducts(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
  }, [query, categoryId, sort, priceFilter, page]);

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
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
