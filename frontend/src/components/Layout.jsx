import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  // Admin chỉ sống trong khu /admin — chặn mọi lối vào phần mua sắm của khách.
  if (user?.role === 'Admin' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  // Seller chỉ sống trong khu /seller — không cho lạc vào trang mua sắm của khách.
  if (user?.role === 'Seller' && !location.pathname.startsWith('/seller')) {
    return <Navigate to="/seller" replace />;
  }

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
