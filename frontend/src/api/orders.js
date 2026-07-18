import { USE_MOCK, delay, apiFetch } from './client';
import { orders } from '../mock/data';

export async function getOrders() {
  if (!USE_MOCK) {
    // → GET /api/orders  (đơn của user hiện tại)
    return apiFetch('/orders');
  }
  await delay(300);
  return orders;
}

export async function getOrderById(id) {
  if (!USE_MOCK) {
    // → GET /api/orders/{id}
    return apiFetch(`/orders/${id}`);
  }
  await delay(200);
  return orders.find((o) => o.id === id) ?? null;
}

// cartItemsByShop: [{ shopId, items: [{ productId, quantity, unitPrice }] }]
// Phản ánh đúng luồng Checkout thật: 1 Order cha tách thành nhiều SubOrder theo shop (Ngày 10).
export async function createOrder(cartItemsByShop) {
  if (!USE_MOCK) {
    // → POST /api/orders  (transaction xuyên nhiều bảng qua UnitOfWork ở backend)
    return apiFetch('/orders', { method: 'POST', body: JSON.stringify({ subOrders: cartItemsByShop }) });
  }
  await delay(500);
  const newOrder = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    subOrders: cartItemsByShop.map((group, i) => ({
      id: `suborder-${Date.now()}-${i}`,
      shopId: group.shopId,
      status: 'pending',
      items: group.items,
    })),
  };
  orders.unshift(newOrder);
  return newOrder;
}
