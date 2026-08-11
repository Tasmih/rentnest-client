import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url);
  return response.data.data;
};
