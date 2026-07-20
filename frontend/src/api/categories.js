import { USE_MOCK, delay, apiFetch } from './client';
import { categories } from '../mock/data';

const ICONS_BY_NAME = {
  'Thời trang nam': '👔',
  'Thời trang nữ': '👗',
  'Điện tử': '📱',
  'Đồ gia dụng': '🔌',
  'Thể thao': '🏀',
  'Mỹ phẩm': '💄',
  'Thực phẩm': '🍱',
  'Sách & Văn phòng phẩm': '📚',
};
const DEFAULT_ICON = '🛍️';

function adaptCategory(c) {
  return { id: String(c.id), name: c.name, icon: ICONS_BY_NAME[c.name] ?? DEFAULT_ICON };
}

export async function getCategories() {
  if (!USE_MOCK) {
    const list = await apiFetch('/categories');
    return list.map(adaptCategory);
  }
  await delay(150);
  return categories;
}
