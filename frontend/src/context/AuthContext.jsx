import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set default auth header
  const setAuthHeader = useCallback((tok) => {
    if (tok) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  // Load user from saved token on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthHeader(token);
        try {
          const { data } = await axios.get(`${API}/auth/me`);
          setUser(data);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, setAuthHeader]);

  const login = async (username, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { username, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setAuthHeader(data.token);
    setUser({ _id: data._id, username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
