import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('et_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('et_auth_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const freshUser = await api.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('et_auth_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session expired or invalid token', err);
          // Only clear if server returned error
          if (!user) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('et_auth_token');
            localStorage.removeItem('et_auth_user');
          }
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('et_auth_token', res.token);
    localStorage.setItem('et_auth_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await api.register(name, email, pass, phone);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('et_auth_token', res.token);
    localStorage.setItem('et_auth_user', JSON.stringify(res.user));
  };

  const adminLogin = async (email: string, pass: string) => {
    const res = await api.adminLogin(email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('et_auth_token', res.token);
    localStorage.setItem('et_auth_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('et_auth_token');
    localStorage.removeItem('et_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        adminLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
