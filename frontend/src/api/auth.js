import { USE_MOCK, delay, apiFetch, setTokens, clearTokens, getRefreshToken } from './client';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

// Backend JWT không tự chứa "fullName" trong claim (chỉ sub/email/role) — decode để lấy
// userId/email/role thật, fullName dùng tên đã biết (lúc đăng ký) hoặc phần trước @ của email.
function decodeJwt(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return JSON.parse(json);
}

function buildUserFromToken(accessToken, fallbackFullName) {
  const claims = decodeJwt(accessToken);
  return {
    id: claims.sub,
    email: claims.email,
    role: claims[ROLE_CLAIM],
    fullName: fallbackFullName || claims.email.split('@')[0],
  };
}

export async function login({ email, password }) {
  if (!USE_MOCK) {
    const result = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setTokens(result);
    return { user: buildUserFromToken(result.accessToken), accessToken: result.accessToken };
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

export async function register({ email, password, fullName, role = 'Customer' }) {
  if (!USE_MOCK) {
    const result = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
    setTokens(result);
    return { user: buildUserFromToken(result.accessToken, fullName), accessToken: result.accessToken };
  }
  await delay(400);
  if (!email || !password || !fullName) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }
  return {
    user: { id: 'user-1', email, fullName, role },
    accessToken: 'mock-access-token',
  };
}

export function logout() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    apiFetch('/auth/revoke', { method: 'POST', body: JSON.stringify({ refreshToken }) }).catch(() => {});
  }
  clearTokens();
}

// Backend chưa có endpoint quên/đặt lại mật khẩu hay đăng nhập Google — giữ mock cho 2 hàm này
// (không rẽ theo USE_MOCK) để UI không vỡ, không phải vì quên nối API thật.

export async function forgotPassword({ email }) {
  await delay(500);
  if (!email) {
    throw new Error('Vui lòng nhập email');
  }
  return { message: `Đã gửi liên kết đặt lại mật khẩu tới ${email}` };
}

export async function resetPassword({ password }) {
  await delay(500);
  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }
  return { message: 'Đổi mật khẩu thành công' };
}

export async function loginWithGoogle() {
  await delay(500);
  return {
    user: { id: 'user-google-1', email: 'vendra.user@gmail.com', fullName: 'Vendra User', role: 'Customer' },
    accessToken: 'mock-google-access-token',
  };
}
