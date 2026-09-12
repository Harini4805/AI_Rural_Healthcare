import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';
import { jwtDecode } from 'jwt-decode';

export type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthState() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const navigate = useNavigate();

  let role = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      role = decoded.role || null;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    localStorage.setItem('access_token', result.access_token);
    setToken(result.access_token);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/login');
  };

  return { token, role, login, logout, isAuthenticated: !!token };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
