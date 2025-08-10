import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  User,
  UserProfile,
  Country,
  State,
  District,
  Group,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
  ChangePasswordData,
  PaginatedResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User; profile?: UserProfile }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<{ user: User; profile?: UserProfile }> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<{ message: string }> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Geographic API
export const geographicAPI = {
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get('/geographic/countries');
    return response.data;
  },

  getStates: async (countryId: number): Promise<State[]> => {
    const response = await api.get(`/geographic/states/${countryId}`);
    return response.data;
  },

  getDistricts: async (stateId: number): Promise<District[]> => {
    const response = await api.get(`/geographic/districts/${stateId}`);
    return response.data;
  },
};

// Groups API
export const groupsAPI = {
  getAllGroups: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Group>> => {
    const response = await api.get(`/groups?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: Partial<Group>): Promise<{ message: string; group: Group }> => {
    const response = await api.post('/groups', data);
    return response.data;
  },
};

export default api;
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getUserDashboard = () => api.get('/dashboard/user');
export const getActivityFeed = (limit?: number) => 
  api.get('/dashboard/activity', { params: { limit } });

// Geographic
export const getCountries = () => api.get('/geographic/countries');
export const getStates = (countryId: number) => api.get(`/geographic/states/${countryId}`);
export const getDistricts = (stateId: number) => api.get(`/geographic/districts/${stateId}`);

// Groups
export const getGroups = (params?: any) => api.get('/groups', { params });
export const getGroup = (id: number) => api.get(`/groups/${id}`);
export const createGroup = (data: any) => api.post('/groups', data);
export const updateGroup = (id: number, data: any) => api.put(`/groups/${id}`, data);
export const deleteGroup = (id: number) => api.delete(`/groups/${id}`);
export const getGroupCategories = () => api.get('/groups/categories/all');

// Labor
export const getLaborProfiles = (params?: any) => api.get('/labor', { params });
export const getLaborProfile = (id: number) => api.get(`/labor/${id}`);
export const createLaborProfile = (data: any) => api.post('/labor', data);
export const updateLaborProfile = (id: number, data: any) => api.put(`/labor/${id}`, data);
export const deleteLaborProfile = (id: number) => api.delete(`/labor/${id}`);
export const getLaborCategories = () => api.get('/labor/categories/all');

// Needy Services
export const getNeedyServices = (params?: any) => api.get('/needy', { params });
export const getNeedyService = (id: number) => api.get(`/needy/${id}`);
export const createNeedyService = (data: any) => api.post('/needy', data);
export const updateNeedyService = (id: number, data: any) => api.put(`/needy/${id}`, data);
export const deleteNeedyService = (id: number) => api.delete(`/needy/${id}`);
export const getNeedyCategories = () => api.get('/needy/categories/all');

// Users
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data: any) => api.put('/users/profile', data);
export const changePassword = (data: any) => api.put('/users/change-password', data);
export const getUsers = (params?: any) => api.get('/users', { params });

export default api;