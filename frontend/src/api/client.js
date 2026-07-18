// Cờ chuyển đổi mock <-> API .NET thật.
// Khi backend Vendra.Api có endpoint thật (Ngày 3+), đổi USE_MOCK = false
// và cập nhật BASE_URL — các hàm trong src/api/*.js sẽ tự chuyển sang gọi fetch() thật,
// không cần sửa lại bất kỳ trang/component nào (chúng chỉ import từ src/api/*.js).

export const USE_MOCK = true;
export const BASE_URL = 'https://localhost:7161/api';

// Giả lập độ trễ mạng để UI (loading state) trông giống thật.
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
