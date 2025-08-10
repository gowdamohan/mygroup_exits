export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  group_id: number;
  active: boolean;
  profile_img?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Labor {
  id: number;
  name: string;
  phone: string;
  email?: string;
  skills: string;
  experience: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface NeedyService {
  id: number;
  title: string;
  description: string;
  category: string;
  price?: number;
  location: string;
  provider_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  title: string;
  type: 'tv' | 'radio' | 'news' | 'magazine' | 'webnews' | 'youtube';
  content: string;
  thumbnail?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  title: string;
  type: 'popup' | 'header' | 'sidebar' | 'main';
  image_url: string;
  link_url?: string;
  duration?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Geographic {
  id: number;
  name: string;
  type: 'continent' | 'country' | 'state' | 'district';
  parent_id?: number;
  code?: string;
}