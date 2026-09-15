import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devcore_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('devcore_token');
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem('devcore_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to fetch me details:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('devcore_token', res.data.token);
      localStorage.setItem('devcore_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      await fetchCurrentUser();
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    if (res.data.success) {
      localStorage.setItem('devcore_token', res.data.token);
      localStorage.setItem('devcore_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      await fetchCurrentUser();
      return res.data;
    }
    throw new Error(res.data.message || 'Signup failed');
  };

  const logout = () => {
    localStorage.removeItem('devcore_token');
    localStorage.removeItem('devcore_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isApplicant: user?.role === 'applicant',
        isOrganization: user?.role === 'organization',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
