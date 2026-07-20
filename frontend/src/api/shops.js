import { USE_MOCK, delay, apiFetch } from './client';
import { shops, getShopById as findMockShop } from '../mock/data';

const PLACEHOLDER_AVATAR = 'https://picsum.photos/seed/vendra-shop/100';

// Shop thật (ShopDto) không có avatar/rating/followers/location — đây chỉ là field trang trí
// UI mock cần, điền giá trị mặc định hợp lý thay vì sửa lại từng trang dùng chúng.
function adaptShop(dto) {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? '',
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
