import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';
import './Header.css';

export default function Header() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__top">
        <div className="container header__top-inner">
          <span>Kênh Người Bán</span>
          <span className="header__divider" />
          <span>Kết nối</span>
          <div className="header__top-right">
            {user ? (
              <>
                <span>{user.fullName}</span>
                <button type="button" className="header__link-btn" onClick={logout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/register">Đăng Ký</Link>
                <span className="header__divider" />
                <Link to="/login">Đăng Nhập</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="header__main container">
        <Link to="/" className="header__logo">
          Vendra
        </Link>

        <form className="header__search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            🔍
          </button>
        </form>

        <Link to="/cart" className="header__cart">
          <CartIcon size={26} />
          {totalCount > 0 && <span className="header__cart-badge">{totalCount}</span>}
          {items.length > 0 && (
            <div className="header__cart-preview">
              <p className="header__cart-preview-title">Sản phẩm mới thêm</p>
              {items.slice(0, 4).map((i) => (
                <div key={i.productId} className="header__cart-preview-item">
                  <img src={i.product.image} alt={i.product.name} />
                  <span>{i.product.name}</span>
                </div>
              ))}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
