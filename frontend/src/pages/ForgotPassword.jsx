import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../api/auth';
import './Auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // request → sent → reset → done
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword({ email });
      setStep('sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword({ password: newPassword });
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'sent') {
    return (
      <div className="skeleton-page auth-page">
        <div className="auth-card card">
          <h1>Kiểm Tra Email</h1>
          <p className="auth-sent-message">
            Đã gửi liên kết đặt lại mật khẩu tới <strong>{email}</strong>
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setStep('reset')}>
            Mở Liên Kết Trong Email (demo)
          </button>
          <p className="auth-switch">
            <Link to="/login">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div className="skeleton-page auth-page">
        <form className="auth-card card" onSubmit={handleResetSubmit}>
          <h1>Đặt Mật Khẩu Mới</h1>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="skeleton-page auth-page">
        <div className="auth-card card">
          <h1>Đổi Mật Khẩu Thành Công</h1>
          <p className="auth-sent-message">Bạn có thể đăng nhập lại bằng mật khẩu mới.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
            Quay Lại Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-page auth-page">
      <form className="auth-card card" onSubmit={handleRequestSubmit}>
        <h1>Quên Mật Khẩu</h1>
        <p className="auth-hint">Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Gửi Liên Kết'}
        </button>
        <p className="auth-switch">
          Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
