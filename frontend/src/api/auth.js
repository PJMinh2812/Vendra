import { USE_MOCK, delay, apiFetch } from './client';

export async function login({ email, password }) {
  if (!USE_MOCK) {
    // → POST /api/auth/login  (trả về accessToken + refreshToken theo thiết kế JWT Ngày 6)
    return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }
  await delay(400);
  if (!email || !password) {
    throw new Error('Vui lòng nhập email và mật khẩu');
  }
  return {
    user: { id: 'user-1', email, fullName: email.split('@')[0], role: 'Customer' },
    accessToken: 'mock-access-token',
  };
}

export async function register({ email, password, fullName }) {
  if (!USE_MOCK) {
    // → POST /api/auth/register
    return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, fullName }) });
  }
  await delay(400);
  if (!email || !password || !fullName) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }
  return {
    user: { id: 'user-1', email, fullName, role: 'Customer' },
    accessToken: 'mock-access-token',
  };
}

export async function forgotPassword({ email }) {
  if (!USE_MOCK) {
    // → POST /api/auth/forgot-password  (gửi email chứa link/token đặt lại mật khẩu)
    return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  }
  await delay(500);
  if (!email) {
    throw new Error('Vui lòng nhập email');
  }
  return { message: `Đã gửi liên kết đặt lại mật khẩu tới ${email}` };
}

export async function resetPassword({ password }) {
  if (!USE_MOCK) {
    // → POST /api/auth/reset-password  (kèm token nhận từ link trong email)
    return apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ password }) });
  }
  await delay(500);
  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }
  return { message: 'Đổi mật khẩu thành công' };
}

export async function loginWithGoogle() {
  if (!USE_MOCK) {
    // → POST /api/auth/google  (backend đổi Google ID token lấy JWT nội bộ, theo thiết kế Identity Ngày 6)
    return apiFetch('/auth/google', { method: 'POST' });
  }
  await delay(500);
  return {
    user: { id: 'user-google-1', email: 'vendra.user@gmail.com', fullName: 'Vendra User', role: 'Customer' },
    accessToken: 'mock-google-access-token',
  };
}
