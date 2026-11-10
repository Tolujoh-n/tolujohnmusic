import axios from 'axios';
import type {
  ApiResponse,
  HomePayload,
  Track,
  Video,
  TourDate,
  MerchItem,
  MerchOrder,
  MerchOrderStatus,
  Subscriber,
  ContactMessage,
  CurrencyCode,
  SiteSettings,
  SocialLinks,
} from '../types/content';
import type { AuthResponse, AdminProfile } from '../types/auth';
import { getAuthToken } from '../context/AuthContext';

const baseURL = process.env.REACT_APP_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const PublicAPI = {
  getHome: async () => unwrap<HomePayload>((await api.get('/public/home')).data),
  getMusic: async () => unwrap<Track[]>((await api.get('/public/music')).data),
  getVideos: async () => unwrap<Video[]>((await api.get('/public/videos')).data),
  getTours: async (includePast = false) =>
    unwrap<TourDate[]>(
      (
        await api.get('/public/tour-dates', {
          params: { includePast },
        })
      ).data
    ),
  getMerch: async () => unwrap<MerchItem[]>((await api.get('/public/merch')).data),
  getSiteSettings: async () => unwrap<SiteSettings>((await api.get('/public/site-settings')).data),
  subscribe: async (email: string) =>
    (await api.post<{ success: boolean; message: string }>('/public/subscribe', { email })).data,
  contact: async (payload: { name: string; email: string; message: string }) =>
    (await api.post<{ success: boolean; message: string }>('/public/contact', payload)).data,
  submitMerchOrder: async (payload: {
    merchItemId: string;
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    notes?: string;
    quantity?: number;
    currency?: CurrencyCode;
  }) =>
    (await api.post<{ success: boolean; message: string }>('/public/merch-orders', payload)).data,
};

export const AuthAPI = {
  login: async (email: string, password: string) =>
    unwrap<AuthResponse>((await api.post('/auth/login', { email, password })).data),
  getProfile: async () => unwrap<AdminProfile>((await api.get('/auth/me')).data),
  updateProfile: async (payload: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => unwrap<AdminProfile>((await api.put('/auth/me', payload)).data),
};

export const AdminAPI = {
  getDashboard: async () => unwrap<Record<string, number>>((await api.get('/admin/dashboard')).data),
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<
      ApiResponse<{
        url: string;
        publicId: string;
        width?: number;
        height?: number;
        format?: string;
        bytes?: number;
      }>
    >('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return unwrap(response.data);
  },
  getHero: async () => unwrap<HomePayload['hero']>((await api.get('/admin/hero')).data),
  saveHero: async (payload: Record<string, unknown>) =>
    unwrap<HomePayload['hero']>((await api.put('/admin/hero', payload)).data),
  getAbout: async () => unwrap<HomePayload['about']>((await api.get('/admin/about')).data),
  saveAbout: async (payload: Record<string, unknown>) =>
    unwrap<HomePayload['about']>((await api.put('/admin/about', payload)).data),
  listTracks: async () => unwrap<Track[]>((await api.get('/admin/tracks')).data),
  createTrack: async (payload: Partial<Track>) =>
    unwrap<Track>((await api.post('/admin/tracks', payload)).data),
  updateTrack: async (id: string, payload: Partial<Track>) =>
    unwrap<Track>((await api.put(`/admin/tracks/${id}`, payload)).data),
  deleteTrack: async (id: string) => api.delete(`/admin/tracks/${id}`),
  listVideos: async () => unwrap<Video[]>((await api.get('/admin/videos')).data),
  createVideo: async (payload: Partial<Video>) =>
    unwrap<Video>((await api.post('/admin/videos', payload)).data),
  updateVideo: async (id: string, payload: Partial<Video>) =>
    unwrap<Video>((await api.put(`/admin/videos/${id}`, payload)).data),
  deleteVideo: async (id: string) => api.delete(`/admin/videos/${id}`),
  listTours: async () => unwrap<TourDate[]>((await api.get('/admin/tours')).data),
  createTour: async (payload: Partial<TourDate>) =>
    unwrap<TourDate>((await api.post('/admin/tours', payload)).data),
  updateTour: async (id: string, payload: Partial<TourDate>) =>
    unwrap<TourDate>((await api.put(`/admin/tours/${id}`, payload)).data),
  deleteTour: async (id: string) => api.delete(`/admin/tours/${id}`),
  listMerch: async () => unwrap<MerchItem[]>((await api.get('/admin/merch')).data),
  createMerch: async (
    payload: Partial<Omit<MerchItem, 'priceUsd' | 'priceNgn'>> & {
      priceUsd?: number | null;
      priceNgn?: number | null;
    }
  ) => unwrap<MerchItem>((await api.post('/admin/merch', payload)).data),
  updateMerch: async (
    id: string,
    payload: Partial<Omit<MerchItem, 'priceUsd' | 'priceNgn'>> & {
      priceUsd?: number | null;
      priceNgn?: number | null;
    }
  ) => unwrap<MerchItem>((await api.put(`/admin/merch/${id}`, payload)).data),
  deleteMerch: async (id: string) => api.delete(`/admin/merch/${id}`),
  listSubscribers: async () => unwrap<Subscriber[]>((await api.get('/admin/subscribers')).data),
  listMessages: async () => unwrap<ContactMessage[]>((await api.get('/admin/messages')).data),
  updateMessageStatus: async (id: string, status: ContactMessage['status']) =>
    unwrap<ContactMessage>((await api.put(`/admin/messages/${id}/status`, { status })).data),
  listMerchOrders: async () => unwrap<MerchOrder[]>((await api.get('/admin/merch-orders')).data),
  updateMerchOrderStatus: async (id: string, status: MerchOrderStatus) =>
    unwrap<MerchOrder>((await api.put(`/admin/merch-orders/${id}/status`, { status })).data),
  deleteMerchOrder: async (id: string) => api.delete(`/admin/merch-orders/${id}`),
  getSiteSettings: async () => unwrap<SiteSettings>((await api.get('/admin/site-settings')).data),
  saveSiteSettings: async (
    payload: Partial<{
      brandName: string;
      brandTagline: string;
      brandLogo: string;
      siteTitle: string;
      siteDescription: string;
      siteKeywords: string;
      ogImage: string;
      siteUrl: string;
      socialLinks: SocialLinks;
      pageContent: SiteSettings['pageContent'];
      sectionContent: SiteSettings['sectionContent'];
      contactInfo: SiteSettings['contactInfo'];
    }>
  ) => unwrap<SiteSettings>((await api.put('/admin/site-settings', payload)).data),
};
