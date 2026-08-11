import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import {
  LoginCredentials,
  RegisterPayload,
  LoginResponseData,
  RegisterResponseData,
} from '@/types/auth.types';

export const authService = {
  /**
   * Log in user with Express backend JWT authentication
   */
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Register new tenant or landlord user
   */
  async register(payload: RegisterPayload): Promise<RegisterResponseData> {
    const response = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', payload);
    return response.data.data;
  },
};
