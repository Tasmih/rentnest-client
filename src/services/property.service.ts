import api from '@/lib/axios';
import { Property, PropertyFilterParams, PaginationMeta } from '@/types/property.types';
import { adaptPropertyList, adaptProperty } from '@/utils/propertyAdapter';

export interface GetPropertiesResponse {
  data: Property[];
  meta?: PaginationMeta;
}

export const propertyService = {
  /**
   * Fetches real rental properties from backend GET /api/properties.
   * Handles nested response envelopes: response.data.data.data -> Property[].
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

    // Extract property array handling nested envelope ({ data: { meta, data: [...] } })
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
   * Fetches single property by ID from backend GET /api/properties/:id.
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get(`/properties/${id}`);
    const rawProperty = response.data?.data || response.data;
    return adaptProperty(rawProperty);
  },
};
