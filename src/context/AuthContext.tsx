import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  username: string;
  email: string;
  role: string;
  _id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string | null): { id?: string; username?: string; email?: string; role?: string } | null {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded;
  } catch {
    return null;
  }
}

function buildUserFromToken(token: string | null): User | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    username: decoded.username || '',
    email: decoded.email || '',
    role: decoded.role || 'user',
    _id: decoded.id
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ct_token');
    const storedUser = localStorage.getItem('ct_user');

    if (storedToken) {
      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(buildUserFromToken(storedToken));
        }
      } else {
        setUser(buildUserFromToken(storedToken));
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    const resolvedUser = data.user || buildUserFromToken(data.token);

    setToken(data.token);
    setUser(resolvedUser);
    localStorage.setItem('ct_token', data.token);
    localStorage.setItem('ct_user', JSON.stringify(resolvedUser));
  };

  const signup = async (username: string, email: string, password: string) => {
    const data = await api.signup(username, email, password);
    const resolvedUser = data.user || buildUserFromToken(data.token);

    setToken(data.token);
    setUser(resolvedUser);
    localStorage.setItem('ct_token', data.token);
    localStorage.setItem('ct_user', JSON.stringify(resolvedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ct_token');
    localStorage.removeItem('ct_user');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
