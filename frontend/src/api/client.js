// Cờ chuyển đổi mock <-> API .NET thật.
// Backend Vendra.Api đã có đủ endpoint thật (Ngày 3-13) — USE_MOCK = false,
// các hàm trong src/api/*.js gọi fetch() thật, không cần sửa lại bất kỳ trang/component nào
// (chúng chỉ import từ src/api/*.js).

export const USE_MOCK = false;
export const BASE_URL = 'http://localhost:5270/api';

const ACCESS_TOKEN_KEY = 'vendra_access_token';
const REFRESH_TOKEN_KEY = 'vendra_refresh_token';
// Trùng khóa với CartContext (STORAGE_KEY) — không import chéo để tránh vòng lặp
// client -> CartContext -> api/products -> client.
const CART_KEY = 'vendra_cart';
const USER_KEY = 'vendra_user';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(USER_KEY);
}

// Giả lập độ trễ mạng để UI (loading state) trông giống thật (chỉ dùng ở nhánh mock).
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Access token sống ngắn (15 phút, xem Jwt:AccessTokenExpiryMinutes) — gọi fetch() trực tiếp,
// không qua apiFetch, để tránh đệ quy vô hạn nếu chính request refresh cũng trả 401.
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch(path, options = {}, _isRetry = false) {
  const token = getAccessToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401 giữa phiên làm việc thường là access token đã hết hạn (không phải sai mật khẩu) —
  // thử refresh 1 lần rồi gọi lại đúng request cũ. Không áp dụng cho chính /auth/* (login sai
  // mật khẩu cũng trả 401, nhưng đó là lỗi thật, không phải hết hạn — refresh sẽ không giúp gì
  // và làm mất đi thông báo lỗi gốc hữu ích cho người dùng).
  if (res.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(path, options, true);
    }
    clearTokens();
    window.location.href = '/login';
    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  }

  if (res.status === 204) return null;

  let body = null;
  try {
    body = await res.json();
  } catch {
    // không có body (vd lỗi mạng, response rỗng)
  }

  if (!res.ok) {
    // Middleware backend trả {message}; validation lỗi của [ApiController] trả ProblemDetails {title, errors}.
    const message =
      body?.message ||
      body?.title ||
      (body?.errors && Object.values(body.errors).flat().join(', ')) ||
      `Lỗi ${res.status}`;
    throw new Error(message);
  }

  return body;
}
