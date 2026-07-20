import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '../components/GoogleIcon';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ fullName, email, password, role });
      navigate(role === 'Seller' ? '/seller' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleRegister() {
    setError('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="skeleton-page auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h1>Đăng Ký</h1>
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="auth-role-picker">
          <label>
            <input type="radio" checked={role === 'Customer'} onChange={() => setRole('Customer')} />
            Khách hàng — mua sắm
          </label>
          <label>
            <input type="radio" checked={role === 'Seller'} onChange={() => setRole('Seller')} />
            Người bán — mở gian hàng
          </label>
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleRegister}
          disabled={googleSubmitting}
        >
          <GoogleIcon />
          {googleSubmitting ? 'Đang đăng ký...' : 'Đăng ký bằng Google'}
        </button>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
