
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  full_name?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  mobile?: string;
  alternate_mobile?: string;
  email_id?: string;
  address?: string;
  pincode?: string;
  country_id?: number;
  state_id?: number;
  district_id?: number;
  profession_id?: number;
  education_id?: number;
  profile_pic?: string;
  status: 'active' | 'inactive';
  created_date: string;
  updated_date: string;
}

export interface Country {
  id: number;
  country_name: string;
  country_code?: string;
  flag_image?: string;
  status: 'active' | 'inactive';
  created_date: string;
}

export interface State {
  id: number;
  country_id: number;
  state_name: string;
  state_code?: string;
  status: 'active' | 'inactive';
  created_date: string;
}

export interface District {
  id: number;
  state_id: number;
  district_name: string;
  district_code?: string;
  status: 'active' | 'inactive';
  created_date: string;
}

export interface Group {
  id: number;
  user_id: number;
  group_name: string;
  group_description?: string;
  group_category_id?: number;
  group_sub_category_id?: number;
  group_logo?: string;
  group_cover_image?: string;
  privacy_type: 'public' | 'private';
  status: 'active' | 'inactive';
  created_date: string;
  updated_date: string;
  creator?: User;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  full_name?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  mobile?: string;
  alternate_mobile?: string;
  address?: string;
  pincode?: string;
  country_id?: number;
  state_id?: number;
  district_id?: number;
  profession_id?: number;
  education_id?: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  memberCount: number;
  createdDate: string;
  image?: string;
  isPublic: boolean;
  adminId: number;
  admin: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface Labor {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  experience: number;
  location: string;
  phone: string;
  email?: string;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  reviewCount: number;
  photo?: string;
  documents: {
    aadharFront?: string;
    aadharBack?: string;
    photo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NeedyService {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  location: string;
  requestedDate: string;
  completedDate?: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  title: string;
  type: 'tv' | 'radio' | 'magazine' | 'newspaper' | 'web';
  category: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  isActive: boolean;
  viewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag?: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
  countryId: number;
  country?: Country;
}

export interface District {
  id: number;
  name: string;
  code: string;
  stateId: number;
  state?: State;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
