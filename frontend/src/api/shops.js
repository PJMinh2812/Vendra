import { USE_MOCK, delay, apiFetch } from './client';
import { shops, getShopById as findMockShop } from '../mock/data';

export async function getShopById(id) {
  if (!USE_MOCK) {
    // → GET /api/shops/{id}
    return apiFetch(`/shops/${id}`);
  }
  await delay(150);
  return findMockShop(id);
}

export async function getShops() {
  if (!USE_MOCK) {
    // → GET /api/shops
    return apiFetch('/shops');
  }
  await delay(150);
  return shops;
}
