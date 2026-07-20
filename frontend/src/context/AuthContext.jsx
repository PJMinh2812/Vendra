import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);
const STORAGE_KEY = 'vendra_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  async function login(credentials) {
    const result = await authApi.login(credentials);
    setUser(result.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    return result.user;
  }

  async function register(payload) {
    const result = await authApi.register(payload);
    setUser(result.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    return result.user;
  }

  async function loginWithGoogle() {
    const result = await authApi.loginWithGoogle();
    setUser(result.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    return result.user;
  }

  function logout() {
    authApi.logout();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
