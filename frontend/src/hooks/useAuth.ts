import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';

export type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (email: string, password: string, selectedRole: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthState() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));
  const navigate = useNavigate();

  const login = async (email: string, password: string, selectedRole: string) => {
    // In MVP, we just bypass real auth or accept whatever the backend returns 
    // without enforcing the backend's decoded role, allowing the UI to dictate the experience.
    const result = await authService.login(email, password);
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('role', selectedRole);
    setToken(result.access_token);
    setRole(selectedRole);
    
    // Route based on role
    if (selectedRole === 'Admin') navigate('/dashboard/admin');
    else if (selectedRole === 'District Health Officer') navigate('/dashboard/officer');
    else if (selectedRole === 'Field Health Worker') navigate('/dashboard/field');
    else navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  return { token, role, login, logout, isAuthenticated: !!token };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
