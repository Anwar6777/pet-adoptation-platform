import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem('pawconnect_token')) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (_error) {
        localStorage.removeItem('pawconnect_token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = ({ token, user: authenticatedUser }) => {
    localStorage.setItem('pawconnect_token', token);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem('pawconnect_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
};
