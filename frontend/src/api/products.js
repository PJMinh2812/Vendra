import { USE_MOCK, delay, apiFetch } from './client';
import { products, getProductById as findMockProduct } from '../mock/data';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/vendra-placeholder/600/600';

// Backend ProductDto không có sẵn discount/rating/sold/images[] (những field chỉ mock UI mới cần) —
// map sang đúng field tên cũ mà ProductCard/ProductDetail đang dùng, id ép về string để khớp
// cách so sánh id kiểu string sẵn có trong Search.jsx (URL param luôn là string).
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
    rating: 0,
    ratingCount: 0,
    sold: 0,
    stock: dto.stock,
  };
}

function applySort(items, sort) {
  if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
  if (sort === 'newest') return [...items].reverse();
  return items; // 'popular' — backend không có cột lượt bán, giữ nguyên thứ tự server trả về
}

export async function getProducts({ search = '', categoryId = null, sort = 'popular', page = 1, pageSize = 20 } = {}) {
  if (!USE_MOCK) {
    const params = new URLSearchParams({ page, pageSize });
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    const res = await apiFetch(`/products?${params}`);
    return {
      items: applySort(res.items.map(adaptProduct), sort),
      total: res.totalCount,
      page: res.page,
      pageSize: res.pageSize,
    };
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
    const dto = await apiFetch(`/products/${id}`);
    return adaptProduct(dto);
  }
  await delay();
  return findMockProduct(id);
}
