import api from '@/lib/axios';
import { ApiResponse, Property, PropertyFilterParams } from '@/types';

export const propertyService = {
  async getProperties(params?: PropertyFilterParams): Promise<ApiResponse<Property[]>> {
    const response = await api.get<ApiResponse<Property[]>>('/properties', { params });
    return response.data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data.data;
  },
};
