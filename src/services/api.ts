import axios from 'axios';
import {
  Farm,
  SensorReading,
  SensorHistoryPoint,
  WeatherData,
  SatelliteObservation,
  ManagementZone,
  Alert,
  AiAnalysisResult,
  LeafDiseaseDiagnosis,
  FarmReport,
  User
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrivision_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },
  demoLogin: async () => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/demo-login');
    return res.data;
  },
  register: async (data: { name: string; email: string; phone: string; password: string; location: string; farmName: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User; starterFarmId?: string }>('/auth/register', data);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/profile');
    return res.data;
  }
};

export const farmsApi = {
  getAll: async () => {
    const res = await api.get<{ success: boolean; farms: Farm[] }>('/farms');
    return res.data.farms;
  },
  getById: async (id: string) => {
    const res = await api.get<{ success: boolean; farm: Farm }>(`/farms/${id}`);
    return res.data.farm;
  },
  create: async (data: Partial<Farm> & { lengthMeters: number; widthMeters: number; latitude: number; longitude: number }) => {
    const res = await api.post<{ success: boolean; farm: Farm; message: string }>('/farms', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Farm>) => {
    const res = await api.put<{ success: boolean; farm: Farm }>(`/farms/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/farms/${id}`);
    return res.data;
  }
};

export const sensorsApi = {
  getByFarm: async (farmId: string) => {
    const res = await api.get<{ success: boolean; sensor: SensorReading; isDemoSimulated: boolean }>(`/sensors/${farmId}`);
    return res.data.sensor;
  },
  getHistory: async (farmId: string) => {
    const res = await api.get<{ success: boolean; history: SensorHistoryPoint[] }>(`/sensors/${farmId}/history`);
    return res.data.history;
  },
  toggleStatus: async (farmId: string) => {
    const res = await api.post<{ success: boolean; status: 'ONLINE' | 'OFFLINE' }>(`/sensors/${farmId}/toggle`);
    return res.data;
  }
};

export const weatherApi = {
  getByFarm: async (farmId: string) => {
    const res = await api.get<{ success: boolean; weather: WeatherData; source: string; isDemo: boolean }>(`/weather/${farmId}`);
    return res.data.weather;
  }
};

export const satelliteApi = {
  getByFarm: async (farmId: string) => {
    const res = await api.get<{ success: boolean; observations: SatelliteObservation[]; provider: string }>(`/satellite/${farmId}`);
    return res.data.observations;
  }
};

export const zonesApi = {
  getByFarm: async (farmId: string) => {
    const res = await api.get<{ success: boolean; zones: ManagementZone[] }>(`/zones/${farmId}`);
    return res.data.zones;
  },
  updateZone: async (farmId: string, zoneId: string, data: Partial<ManagementZone>) => {
    const res = await api.put<{ success: boolean; zone: ManagementZone }>(`/zones/${farmId}/${zoneId}`, data);
    return res.data.zone;
  }
};

export const aiApi = {
  analyzeFarm: async (farmId: string) => {
    const res = await api.post<{ success: boolean; analysis: AiAnalysisResult; message: string }>('/ai/analyze', { farmId });
    return res.data.analysis;
  },
  detectDisease: async (data: { imageBase64?: string; sampleType?: string; cropType?: string }) => {
    const res = await api.post<{ success: boolean; diagnosis: LeafDiseaseDiagnosis }>('/ai/disease-detection', data);
    return res.data.diagnosis;
  }
};

export const alertsApi = {
  getAll: async (params?: { farmId?: string; severity?: string }) => {
    const res = await api.get<{ success: boolean; alerts: Alert[]; unreadCount: number }>('/alerts', { params });
    return res.data;
  },
  markRead: async (id: string) => {
    const res = await api.put<{ success: boolean; alert: Alert }>(`/alerts/${id}/read`);
    return res.data.alert;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/alerts/${id}`);
    return res.data;
  },
  create: async (data: Partial<Alert>) => {
    const res = await api.post<{ success: boolean; alert: Alert }>('/alerts', data);
    return res.data.alert;
  }
};

export const reportsApi = {
  getByFarm: async (farmId: string) => {
    const res = await api.get<{ success: boolean; report: FarmReport }>(`/reports/${farmId}`);
    return res.data.report;
  }
};

export default api;
