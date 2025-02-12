import api from '@/lib/axios';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: FormData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    const { accessToken, refreshToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  async verifyPhone(phoneNumber: string, otp: string) {
    const response = await api.post('/auth/verify-phone', { phoneNumber, otp });
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}; 