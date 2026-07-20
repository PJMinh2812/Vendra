import { USE_MOCK, delay, apiFetch } from './client';
import { products, getProductById as findMockProduct } from '../mock/data';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/vendra-placeholder/600/600';

// Backend ProductDto không có sẵn discount/images[] (chỉ mock UI mới cần) — map sang đúng field
// tên cũ mà ProductCard/ProductDetail đang dùng, id ép về string để khớp cách so sánh id kiểu
// string sẵn có trong Search.jsx (URL param luôn là string).
// rating/ratingCount/sold lấy thật từ averageRating/reviewCount/soldCount (AutoMapper tính trên
// bảng Reviews/OrderItems).
function adaptProduct(dto) {
  const image = dto.imageUrl || PLACEHOLDER_IMAGE;
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? '',
    categoryId: String(dto.categoryId),
    categoryName: dto.categoryName,
    shopId: String(dto.shopId),
    shopName: dto.shopName,
    price: dto.price,
    originalPrice: dto.price,
    discount: 0,
    image,
    images: [image],
    rating: dto.averageRating ?? 0,
    ratingCount: dto.reviewCount ?? 0,
    sold: dto.soldCount ?? 0,
    stock: dto.stock,
  };
}

function applySort(items, sort) {
  if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
  if (sort === 'newest') return [...items].reverse();
  if (sort === 'popular') return [...items].sort((a, b) => b.sold - a.sold);
  return items;
}

export async function getProducts({
  search = '',
  categoryId = null,
  shopId = null,
  minPrice = null,
  maxPrice = null,
  sort = 'popular',
  page = 1,
  pageSize = 20,
  random = false,
} = {}) {
  if (!USE_MOCK) {
    const params = new URLSearchParams({ page, pageSize });
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    if (shopId) params.set('shopId', shopId);
    if (minPrice != null) params.set('minPrice', minPrice);
    if (maxPrice != null) params.set('maxPrice', maxPrice);
    if (random) params.set('random', 'true');
    const res = await apiFetch(`/products?${params}`);
    return {
      items: applySort(res.items.map(adaptProduct), sort),
      total: res.totalCount,
      page: res.page,
      pageSize: res.pageSize,
      totalPages: Math.max(1, Math.ceil(res.totalCount / res.pageSize)),
    };
  }

  await delay();
  let result = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryId || p.categoryId === categoryId;
    const matchesShop = !shopId || p.shopId === shopId;
    const matchesMin = minPrice == null || p.price >= minPrice;
    const matchesMax = maxPrice == null || p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesShop && matchesMin && matchesMax;
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
    totalPages: Math.max(1, Math.ceil(result.length / pageSize)),
  };
}

export async function getProductById(id) {
  if (!USE_MOCK) {
    const dto = await apiFetch(`/products/${id}`);
    return adaptProduct(dto);
  }
  await delay();
  return findMockProduct(id);
}

// Dùng cho Seller Dashboard — chỉ gọi thật, không có nhánh mock (USE_MOCK đang tắt và các trang
// dùng 3 hàm này chỉ tồn tại để thao tác với backend thật).
export async function createProduct(dto) {
  const created = await apiFetch('/products', { method: 'POST', body: JSON.stringify(dto) });
  return adaptProduct(created);
}

export async function updateProduct(id, dto) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(dto) });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}
