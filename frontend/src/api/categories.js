import { USE_MOCK, delay, apiFetch } from './client';
import { categories } from '../mock/data';

export async function getCategories() {
  if (!USE_MOCK) {
    // → GET /api/categories
    return apiFetch('/categories');
  }
  await delay(150);
  return categories;
}
