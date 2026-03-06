import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and decode user info
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // For mock mode, we use base64 encoded tokens
        // For real JWT, you would decode the JWT payload
        const decoded = JSON.parse(atob(storedToken));
        setUser({ id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin });
      } catch (e) {
        // If it's a real JWT, try to decode it
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: payload.id, email: payload.email, isAdmin: payload.isAdmin });
        } catch (jwtError) {
          logout();
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await import('../services/api').then(mod => mod.apiLogin(email, password));
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await import('../services/api').then(mod => mod.apiRegister(name, email, password));
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};