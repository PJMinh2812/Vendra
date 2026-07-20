// Dữ liệu giả (mock) — phản ánh domain thật của Vendra: Category → Shop → Product,
// giỏ hàng/đơn hàng gom theo Shop (tiền đề cho SubOrder khi backend làm tới Ngày 10).

export const categories = [
  { id: 'cat-1', name: 'Thời trang nam', icon: '👔' },
  { id: 'cat-2', name: 'Thời trang nữ', icon: '👗' },
  { id: 'cat-3', name: 'Điện thoại & Phụ kiện', icon: '📱' },
  { id: 'cat-4', name: 'Máy tính & Laptop', icon: '💻' },
  { id: 'cat-5', name: 'Đồ điện gia dụng', icon: '🔌' },
  { id: 'cat-6', name: 'Nhà cửa & Đời sống', icon: '🏠' },
  { id: 'cat-7', name: 'Sắc đẹp', icon: '💄' },
  { id: 'cat-8', name: 'Giày dép', icon: '👟' },
  { id: 'cat-9', name: 'Túi ví', icon: '👜' },
  { id: 'cat-10', name: 'Đồng hồ', icon: '⌚' },
];

export const shops = [
  { id: 'shop-1', name: 'Vendra Official Store', avatar: 'https://picsum.photos/seed/shop1/100', rating: 4.8, followers: 12500, productsCount: 320, joinedYearsAgo: 3, location: 'TP. Hồ Chí Minh' },
  { id: 'shop-2', name: 'TechZone', avatar: 'https://picsum.photos/seed/shop2/100', rating: 4.6, followers: 8300, productsCount: 150, joinedYearsAgo: 2, location: 'Hà Nội' },
  { id: 'shop-3', name: 'Fashion House', avatar: 'https://picsum.photos/seed/shop3/100', rating: 4.9, followers: 21000, productsCount: 540, joinedYearsAgo: 4, location: 'TP. Hồ Chí Minh' },
  { id: 'shop-4', name: 'Home & Living', avatar: 'https://picsum.photos/seed/shop4/100', rating: 4.5, followers: 4200, productsCount: 90, joinedYearsAgo: 1, location: 'Đà Nẵng' },
];

function makeProduct(id, name, categoryId, shopId, price, opts = {}) {
  const discount = opts.discount ?? 0;
  const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;
  return {
    id,
    name,
    categoryId,
    shopId,
    price,
    originalPrice,
    discount,
    image: `https://picsum.photos/seed/${id}/400/400`,
    images: [0, 1, 2, 3].map((i) => `https://picsum.photos/seed/${id}-${i}/600/600`),
    rating: opts.rating ?? 4.5,
    ratingCount: opts.ratingCount ?? Math.floor(Math.random() * 2000) + 50,
    sold: opts.sold ?? Math.floor(Math.random() * 5000),
    stock: opts.stock ?? Math.floor(Math.random() * 200) + 10,
    description: opts.description ?? `${name} — sản phẩm chính hãng, bảo hành đầy đủ, giao hàng nhanh toàn quốc.`,
  };
}

export const products = [
  makeProduct('p-1', 'Áo thun nam cổ tròn basic', 'cat-1', 'shop-3', 129000, { discount: 20, sold: 3200, rating: 4.7 }),
  makeProduct('p-2', 'Quần jean nam slimfit', 'cat-1', 'shop-3', 349000, { discount: 15, sold: 1800 }),
  makeProduct('p-3', 'Áo sơ mi nữ công sở tay dài', 'cat-2', 'shop-3', 219000, { discount: 30, sold: 4100, rating: 4.8 }),
  makeProduct('p-4', 'Váy liền thân dự tiệc', 'cat-2', 'shop-3', 459000, { sold: 950 }),
  makeProduct('p-5', 'Ốp lưng iPhone 15 Pro Max chống sốc', 'cat-3', 'shop-2', 89000, { discount: 10, sold: 6700, rating: 4.6 }),
  makeProduct('p-6', 'Tai nghe Bluetooth TWS chống ồn', 'cat-3', 'shop-2', 399000, { discount: 25, sold: 2300 }),
  makeProduct('p-7', 'Sạc nhanh 65W GaN 3 cổng', 'cat-3', 'shop-2', 259000, { sold: 1400 }),
  makeProduct('p-8', 'Laptop Vendra Book 14" i5 16GB', 'cat-4', 'shop-2', 14990000, { discount: 12, sold: 87, rating: 4.9 }),
  makeProduct('p-9', 'Chuột không dây văn phòng', 'cat-4', 'shop-2', 149000, { sold: 3400 }),
  makeProduct('p-10', 'Bàn phím cơ Blue switch RGB', 'cat-4', 'shop-2', 599000, { discount: 18, sold: 720 }),
  makeProduct('p-11', 'Nồi chiên không dầu 5.5L', 'cat-5', 'shop-4', 1290000, { discount: 20, sold: 2100, rating: 4.7 }),
  makeProduct('p-12', 'Máy xay sinh tố đa năng', 'cat-5', 'shop-4', 690000, { sold: 890 }),
  makeProduct('p-13', 'Bộ chăn ga gối cotton 4 món', 'cat-6', 'shop-4', 459000, { discount: 15, sold: 1300 }),
  makeProduct('p-14', 'Đèn ngủ cảm ứng để bàn', 'cat-6', 'shop-4', 179000, { sold: 2600 },),
  makeProduct('p-15', 'Son kem lì Vendra Beauty', 'cat-7', 'shop-1', 159000, { discount: 25, sold: 8900, rating: 4.8 }),
  makeProduct('p-16', 'Kem chống nắng SPF50+ PA++++', 'cat-7', 'shop-1', 219000, { sold: 5100 }),
  makeProduct('p-17', 'Giày sneaker unisex trắng basic', 'cat-8', 'shop-1', 499000, { discount: 20, sold: 3300, rating: 4.6 }),
  makeProduct('p-18', 'Dép sandal quai ngang nữ', 'cat-8', 'shop-1', 199000, { sold: 1700 }),
  makeProduct('p-19', 'Túi tote vải canvas', 'cat-9', 'shop-1', 149000, { discount: 10, sold: 990 }),
  makeProduct('p-20', 'Đồng hồ thể thao dây silicon', 'cat-10', 'shop-1', 349000, { discount: 30, sold: 1600, rating: 4.5 }),
];

export function getProductById(id) {
  return products.find((p) => p.id === id) ?? null;
}

export function getShopById(id) {
  return shops.find((s) => s.id === id) ?? null;
}

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) ?? null;
}

// Vài đơn hàng mẫu để hiển thị trang Orders trước khi có Checkout thật.
export const orders = [
  {
    id: 'order-1',
    createdAt: '2026-07-10T09:30:00Z',
    subOrders: [
      {
        id: 'suborder-1',
        shopId: 'shop-2',
        status: 'delivered',
        items: [
          { productId: 'p-6', quantity: 1, unitPrice: 299250 },
          { productId: 'p-7', quantity: 1, unitPrice: 259000 },
        ],
      },
      {
        id: 'suborder-2',
        shopId: 'shop-1',
        status: 'shipping',
        items: [{ productId: 'p-15', quantity: 2, unitPrice: 119250 }],
      },
    ],
  },
];
