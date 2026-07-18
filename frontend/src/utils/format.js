export function formatPrice(value) {
  return value.toLocaleString('vi-VN') + '₫';
}

export function formatSold(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k đã bán`;
  return `${count} đã bán`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
