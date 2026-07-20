import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';
import './Header.css';

export default function Header() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { totalCount, items, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ấn để mở, ấn ra ngoài để đóng lại — không mở theo hover nữa.
  useEffect(() => {
    if (!userMenuOpen) return;
    function onClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [userMenuOpen]);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__top">
        <div className="container header__top-inner">
          <Link to="/seller">Kênh Người Bán</Link>
          {user?.role === 'Admin' && (
            <>
              <span className="header__divider" />
              <Link to="/admin/shops">Quản Trị</Link>
            </>
          )}
          <span className="header__divider" />
          <span>Kết nối</span>
          <div className="header__top-right">
            {user ? (
              <div className="header__user" ref={userMenuRef}>
                <span className="header__user-name" onClick={() => setUserMenuOpen((v) => !v)}>
                  {user.fullName}
                </span>
                {userMenuOpen && (
                  <div className="header__user-menu">
                    <p className="header__user-menu-email">{user.email}</p>
                    {user.role === 'Customer' && (
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}>
                        Đơn Mua
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        clearCart();
                        navigate('/login');
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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
