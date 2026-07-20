// Cờ chuyển đổi mock <-> API .NET thật.
// Backend Vendra.Api đã có đủ endpoint thật (Ngày 3-13) — USE_MOCK = false,
// các hàm trong src/api/*.js gọi fetch() thật, không cần sửa lại bất kỳ trang/component nào
// (chúng chỉ import từ src/api/*.js).

export const USE_MOCK = false;
export const BASE_URL = 'http://localhost:5270/api';

const ACCESS_TOKEN_KEY = 'vendra_access_token';
const REFRESH_TOKEN_KEY = 'vendra_refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Giả lập độ trễ mạng để UI (loading state) trông giống thật (chỉ dùng ở nhánh mock).
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

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
