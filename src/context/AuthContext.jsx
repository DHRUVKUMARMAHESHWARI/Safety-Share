import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          console.error('Auth verification failed', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (emailOrPhone, password) => {
    try {
      const response = await api.post('/auth/login', { emailOrPhone, password });
      const { token, refreshToken, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, refreshToken, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      
      setUser(newUser);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error check', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };
  
  const googleLogin = async (tokenId) => {
      try {
        const response = await api.post('/auth/google', { tokenId });
        const { token, refreshToken, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        
        setUser(userData);
        toast.success(`Welcome ${userData.name}!`);
        return true;
      } catch (error) {
          console.error('Google login error', error);
          toast.error('Google login failed');
          throw error;
      }
  }

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.error || 'Update failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleLogin, updateUserProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
