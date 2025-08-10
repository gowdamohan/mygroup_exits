
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User, profile?: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user);
          setProfile(userData.profile || null);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Fetch complete profile
      try {
        const userData = await authAPI.getCurrentUser();
        setProfile(userData.profile || null);
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setProfile(null);
    }
  };

  const updateUser = (newUser: User, newProfile?: UserProfile) => {
    setUser(newUser);
    if (newProfile !== undefined) {
      setProfile(newProfile);
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
