import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_campus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user && user.token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(prev => ({ ...prev, ...res.data }));
          }
        } catch (err) {
          console.error('Failed to verify session token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      setUser(res.data);
      localStorage.setItem('smart_campus_user', JSON.stringify(res.data));
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      setUser(res.data);
      localStorage.setItem('smart_campus_user', JSON.stringify(res.data));
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_campus_user');
  };

  const updateProfileState = (updatedData) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('smart_campus_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
