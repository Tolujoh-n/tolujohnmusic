export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'editor';
}

export interface AuthResponse {
  token: string;
  admin: AdminProfile;
}

