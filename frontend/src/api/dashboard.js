import { apiFetch } from './client';

// --- Admin Dashboard ---
export async function getDashboardStats() {
  return apiFetch('/dashboard/stats');
}
