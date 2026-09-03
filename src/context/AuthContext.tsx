import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Farm } from '../types';
import { authApi, farmsApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  farms: Farm[];
  selectedFarm: Farm | null;
  selectedFarmId: string;
  setSelectedFarmId: (id: string) => void;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string; location: string; farmName: string }) => Promise<void>;
  logout: () => void;
  refreshFarms: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('agrivision_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm_001');

  const refreshFarms = async () => {
    try {
      const fetchedFarms = await farmsApi.getAll();
      setFarms(fetchedFarms);
      if (fetchedFarms.length > 0) {
        if (!fetchedFarms.some(f => f.id === selectedFarmId)) {
          setSelectedFarmId(fetchedFarms[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load farms', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agrivision_token');
      if (storedToken) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile.user);
          await refreshFarms();
        } catch {
          localStorage.removeItem('agrivision_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, pass);
      localStorage.setItem('agrivision_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshFarms();
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.demoLogin();
      localStorage.setItem('agrivision_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshFarms();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string; location: string; farmName: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      localStorage.setItem('agrivision_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshFarms();
      if (res.starterFarmId) {
        setSelectedFarmId(res.starterFarmId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agrivision_token');
    setToken(null);
    setUser(null);
  };

  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0] || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        farms,
        selectedFarm,
        selectedFarmId,
        setSelectedFarmId,
        login,
        demoLogin,
        register,
        logout,
        refreshFarms
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
