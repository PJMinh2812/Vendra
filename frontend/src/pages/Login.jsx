import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import './Auth.css';

const DEMO_ACCOUNTS = [
  { role: 'Customer', email: 'customer@vendra.test', password: 'Customer@123456' },
  { role: 'Seller', email: 'seller@vendra.test', password: 'Seller@123456' },
  { role: 'Admin', email: 'admin@vendra.test', password: 'Admin@123456' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedIn = await login({ email, password });
      if (loggedIn.role === 'Admin') navigate('/admin');
      else if (loggedIn.role === 'Seller') navigate('/seller');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken) {
    setError('');
    try {
      const loggedIn = await loginWithGoogle(idToken);
      if (loggedIn.role === 'Admin') navigate('/admin');
      else if (loggedIn.role === 'Seller') navigate('/seller');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="skeleton-page auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h1>Đăng Nhập</h1>
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
        <Link to="/forgot-password" className="auth-forgot-link">
          Quên mật khẩu?
        </Link>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <GoogleAuthButton onSuccess={handleGoogleCredential} onError={setError} />

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>

      <div className="auth-demo-accounts card">
        <h3>Tài khoản demo (bấm để điền)</h3>
        <table>
          <thead>
            <tr>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Mật khẩu</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACCOUNTS.map((acc) => (
              <tr
                key={acc.email}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                }}
              >
                <td>{acc.role}</td>
                <td>{acc.email}</td>
                <td>{acc.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
