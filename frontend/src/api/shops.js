import { USE_MOCK, delay, apiFetch } from './client';
import { shops, getShopById as findMockShop } from '../mock/data';

const PLACEHOLDER_AVATAR = 'https://picsum.photos/seed/vendra-shop/100';

// Shop thật (ShopDto) không có avatar/rating/followers/location — đây chỉ là field trang trí
// UI mock cần, điền giá trị mặc định hợp lý thay vì sửa lại từng trang dùng chúng.
function adaptShop(dto) {
  return {
    id: String(dto.id),
    ownerUserId: dto.ownerUserId,
    name: dto.name,
    description: dto.description ?? '',
    status: dto.status,
    createdAt: dto.createdAt,
    avatar: PLACEHOLDER_AVATAR,
    rating: 0,
    followers: 0,
    productsCount: 0,
    joinedYearsAgo: 0,
    location: '',
  };
}

export async function getShopById(id) {
  if (!USE_MOCK) {
    // Chỉ có GET /api/shops/{id} công khai (shop đã Approved) — chưa có endpoint /api/shops
    // công khai liệt kê tất cả shop, xem getShops() bên dưới.
    const dto = await apiFetch(`/shops/${id}`);
    return adaptShop(dto);
  }
  await delay(150);
  return findMockShop(id);
}

export async function getShops() {
  // Chưa có endpoint public liệt kê toàn bộ shop ở backend (GET /api/shops hiện chỉ dành cho Admin)
  // và không có trang nào trong frontend gọi hàm này — giữ mock, không phải quên nối API thật.
  await delay(150);
  return shops;
}

// --- Seller Dashboard ---

export async function registerShop({ name, description }) {
  const dto = await apiFetch('/shops', { method: 'POST', body: JSON.stringify({ name, description }) });
  return adaptShop(dto);
}

export async function getMyShop() {
  try {
    const dto = await apiFetch('/shops/mine');
    return adaptShop(dto);
  } catch {
    // 404 (Not Found) nghĩa là Seller chưa đăng ký shop — coi như "chưa có", không phải lỗi.
    return null;
  }
}

// --- Admin Dashboard ---

export async function getAllShops(status) {
  const params = status ? `?status=${encodeURIComponent(status)}` : '';
  const list = await apiFetch(`/shops${params}`);
  return list.map(adaptShop);
}

export async function approveShop(id) {
  return apiFetch(`/shops/${id}/approve`, { method: 'PUT' });
}

export async function rejectShop(id) {
  return apiFetch(`/shops/${id}/reject`, { method: 'PUT' });
}
