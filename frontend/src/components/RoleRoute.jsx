import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RoleRoute.css';

// Chưa đăng nhập -> chuyển thẳng /login (không có gì để giải thích).
// Đăng nhập rồi nhưng sai role -> hiển thị lý do tại chỗ, không redirect ngầm — vì backend
// không có API "nâng cấp" role cho tài khoản đã tồn tại, Customer muốn bán hàng phải đăng ký
// một tài khoản Seller riêng.
export default function RoleRoute({ allow, children }) {
  const { user } = useAuth();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    return (
      <div className="skeleton-page container role-route-denied">
        <p>🚫 Chức năng này dành cho tài khoản {allowed.join(' hoặc ')}.</p>
        <p className="text-muted">
          Tài khoản hiện tại của bạn có vai trò <strong>{user.role}</strong>.
          {allowed.includes('Seller') && ' Muốn bán hàng, hãy đăng ký một tài khoản Người bán riêng.'}
        </p>
      </div>
    );
  }

  return children;
}
