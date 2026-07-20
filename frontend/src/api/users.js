import { apiFetch } from './client';

// --- Admin Dashboard ---
export async function getAllUsers() {
  return apiFetch('/users');
}

export async function lockUser(id) {
  return apiFetch(`/users/${id}/lock`, { method: 'PUT' });
}

export async function unlockUser(id) {
  return apiFetch(`/users/${id}/unlock`, { method: 'PUT' });
}
