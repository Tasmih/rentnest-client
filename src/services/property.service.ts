import api from '@/lib/axios';
import { Property, PropertyFilterParams, PaginationMeta } from '@/types/property.types';
import { adaptPropertyList, adaptProperty } from '@/utils/propertyAdapter';

export interface GetPropertiesResponse {
  data: Property[];
  meta?: PaginationMeta;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  rent: number;
  serviceCharge?: number;
  utilityCharge?: number;
  area: string;
  address: string;
  propertyType: string;
  categoryId: string;
  floor?: number;
  totalFloors?: number;
  bedrooms?: number;
  bathrooms?: number;
  coverImage?: string;
  furnished?: boolean;
  parking?: boolean;
  lift?: boolean;
  bachelorAllowed?: boolean;
  familyAllowed?: boolean;
  status?: string;
}

export const propertyService = {
  /**
   * Fetches real rental properties from backend GET /api/properties.
   */
  async getProperties(params?: PropertyFilterParams): Promise<GetPropertiesResponse> {
    const queryParams: Record<string, any> = {};

    if (params) {
      const areaValue = params.area || params.city || params.query;
      if (areaValue?.trim()) {
        queryParams.area = areaValue.trim();
      }

      if (params.propertyType) {
        queryParams.propertyType = params.propertyType;
      }

      const minRentVal = params.minRent ?? params.minPrice;
      if (minRentVal !== undefined && minRentVal !== null) {
        queryParams.minRent = minRentVal;
      }

      const maxRentVal = params.maxRent ?? params.maxPrice;
      if (maxRentVal !== undefined && maxRentVal !== null) {
        queryParams.maxRent = maxRentVal;
      }

      if (params.page) {
        queryParams.page = params.page;
      }

      if (params.limit) {
        queryParams.limit = params.limit;
      }
    }

    const response = await api.get('/properties', { params: queryParams });

    const responsePayload = response.data?.data;
    const rawProperties = Array.isArray(responsePayload)
      ? responsePayload
      : Array.isArray(responsePayload?.data)
      ? responsePayload.data
      : Array.isArray(response.data?.properties)
      ? response.data.properties
      : Array.isArray(response.data)
      ? response.data
      : [];

    const meta = responsePayload?.meta || response.data?.meta;

    const properties = adaptPropertyList(rawProperties);
    return {
      data: properties,
      meta,
    };
  },

  /**
   * Fetches landlord's properties from backend GET /api/properties?landlordId={landlordId}
   */
  async getMyProperties(landlordId: string): Promise<Property[]> {
    const response = await api.get('/properties', { params: { landlordId, limit: 100 } });
    const responsePayload = response.data?.data;
    const rawProperties = Array.isArray(responsePayload)
      ? responsePayload
      : Array.isArray(responsePayload?.data)
      ? responsePayload.data
      : Array.isArray(response.data)
      ? response.data
      : [];

    return adaptPropertyList(rawProperties);
  },

  /**
   * Fetches single property by ID from backend GET /api/properties/:id.
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get(`/properties/${id}`);
    const rawProperty = response.data?.data || response.data;
    return adaptProperty(rawProperty);
  },

  /**
   * Landlord / Admin: Create new property listing POST /api/properties
   */
  async createProperty(payload: CreatePropertyPayload): Promise<Property> {
    const response = await api.post('/properties', payload);
    const rawProperty = response.data?.data || response.data;
    return adaptProperty(rawProperty);
  },

  /**
   * Landlord / Admin: Update property listing PATCH /api/properties/:id
   */
  async updateProperty(id: string, payload: Partial<CreatePropertyPayload>): Promise<Property> {
    const response = await api.patch(`/properties/${id}`, payload);
    const rawProperty = response.data?.data || response.data;
    return adaptProperty(rawProperty);
  },

  /**
   * Landlord / Admin: Delete property listing DELETE /api/properties/:id
   */
  async deleteProperty(id: string): Promise<boolean> {
    await api.delete(`/properties/${id}`);
    return true;
  },
};
