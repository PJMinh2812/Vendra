import { USE_MOCK, delay, apiFetch } from './client';
import { products, getProductById as findMockProduct } from '../mock/data';

export async function getProducts({ search = '', categoryId = null, sort = 'popular', page = 1, pageSize = 20 } = {}) {
  if (!USE_MOCK) {
    // → GET /api/products?search=&categoryId=&sort=&page=&pageSize=
    const params = new URLSearchParams({ search, sort, page, pageSize });
    if (categoryId) params.set('categoryId', categoryId);
    return apiFetch(`/products?${params}`);
  }

  await delay();
  let result = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryId || p.categoryId === categoryId;
    return matchesSearch && matchesCategory;
  });

  if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
  else if (sort === 'newest') result = [...result].reverse();
  else result = [...result].sort((a, b) => b.sold - a.sold); // popular

  const start = (page - 1) * pageSize;
  return {
    items: result.slice(start, start + pageSize),
    total: result.length,
    page,
    pageSize,
  };
}

export async function getProductById(id) {
  if (!USE_MOCK) {
    // → GET /api/products/{id}
    return apiFetch(`/products/${id}`);
  }
  await delay();
  return findMockProduct(id);
}
