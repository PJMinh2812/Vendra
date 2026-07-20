import { USE_MOCK, delay, apiFetch } from './client';
import { orders } from '../mock/data';

// OrderItemDto/SubOrderDto thật đã snapshot sẵn productName/unitPrice/shopName ngay trong response —
// không cần gọi thêm getProductById/getShopById như bản mock (vốn chỉ lưu id, phải tra cứu thêm).
function adaptOrderItem(item) {
  return {
    productId: String(item.productId),
    productName: item.productName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  };
}

function adaptSubOrder(sub) {
  return {
    shopId: String(sub.shopId),
    shopName: sub.shopName,
    status: (sub.status || 'pending').toLowerCase(),
    subtotal: sub.subtotal,
    items: sub.items.map(adaptOrderItem),
  };
}

function adaptOrder(dto) {
  return {
    id: String(dto.id),
    createdAt: dto.createdAt,
    totalAmount: dto.totalAmount,
    shippingAddress: dto.shippingAddress,
    paymentMethod: dto.paymentMethod,
    paymentStatus: dto.paymentStatus,
    payUrl: dto.payUrl ?? null,
    subOrders: dto.subOrders.map(adaptSubOrder),
  };
}

export async function getOrders() {
  if (!USE_MOCK) {
    // → GET /api/orders (đơn của user hiện tại, phân trang — lấy 1 trang lớn cho trang Orders)
    const res = await apiFetch('/orders?page=1&pageSize=50');
    return res.items.map(adaptOrder);
  }
  await delay(300);
  return orders;
}

export async function getOrderById(id) {
  if (!USE_MOCK) {
    // → GET /api/orders/{id}
    const dto = await apiFetch(`/orders/${id}`);
    return adaptOrder(dto);
  }
  await delay(200);
  return orders.find((o) => o.id === id) ?? null;
}

// { shippingAddress, paymentMethod: 'COD' | 'MoMo' } — backend tự lấy giỏ hàng của user hiện tại
// (đã đồng bộ lên server ngay trước khi gọi hàm này), không nhận danh sách sản phẩm từ client.
export async function createOrder({ shippingAddress, paymentMethod }) {
  if (!USE_MOCK) {
    const dto = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    });
    return adaptOrder(dto);
  }
  await delay(500);
  const newOrder = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    shippingAddress,
    paymentMethod,
    subOrders: [],
  };
  orders.unshift(newOrder);
  return newOrder;
}

// Chỉ Customer tự hủy được, và chỉ khi SubOrder còn "Pending" — backend tự kiểm tra lại
// (không đủ điều kiện thì ném lỗi 400 với message rõ ràng, vd đơn MoMo đã thanh toán).
export async function cancelSubOrder(orderId, shopId) {
  return apiFetch(`/orders/${orderId}/shops/${shopId}/cancel`, { method: 'PUT' });
}

// SellerSubOrderDto phẳng hơn OrderDto (không có shopId/shopName vì luôn ngầm định là shop của
// người gọi) — dùng lại adaptOrderItem nhưng map riêng cấp ngoài.
function adaptSellerSubOrder(sub) {
  return {
    orderId: String(sub.orderId),
    createdAt: sub.createdAt,
    status: (sub.status || 'pending').toLowerCase(),
    subtotal: sub.subtotal,
    items: sub.items.map(adaptOrderItem),
  };
}

// --- Seller Dashboard ---
export async function getShopOrders(page = 1) {
  const res = await apiFetch(`/orders/shop?page=${page}&pageSize=50`);
  return { items: res.items.map(adaptSellerSubOrder), totalPages: Math.max(1, Math.ceil(res.totalCount / res.pageSize)) };
}

// Luồng cố định: pending -> shipping -> delivered. Backend từ chối (400) nếu
// không đúng bước kế tiếp — Seller không thể nhảy cóc hay đi lùi.
export async function updateSubOrderStatus(orderId, status) {
  return apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// --- Admin Dashboard ---
export async function getAllOrders(page = 1) {
  const res = await apiFetch(`/orders/all?page=${page}&pageSize=20`);
  return { items: res.items.map(adaptOrder), totalPages: Math.max(1, Math.ceil(res.totalCount / res.pageSize)) };
}
