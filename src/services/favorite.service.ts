import api from '@/lib/axios';
import { Property } from '@/types/property.types';
import { adaptProperty } from '@/utils/propertyAdapter';

export interface FavoriteItem {
  id: string;
  createdAt: string;
  property: Property;
}

export const favoriteService = {
  /**
   * Add property to favorites POST /api/favorites/:propertyId
   */
  async addFavorite(propertyId: string): Promise<any> {
    const res = await api.post(`/favorites/${propertyId}`);
    return res.data?.data || res.data;
  },

  /**
   * Fetch current user's favorites GET /api/favorites/my
   */
  async getFavorites(): Promise<FavoriteItem[]> {
    const res = await api.get('/favorites/my');
    const rawList = res.data?.data || (Array.isArray(res.data) ? res.data : []);

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item: any) => ({
      id: item.id,
      createdAt: item.createdAt,
      property: adaptProperty(item.property),
    }));
  },

  /**
   * Remove property from favorites DELETE /api/favorites/:propertyId
   */
  async removeFavorite(propertyId: string): Promise<any> {
    const res = await api.delete(`/favorites/${propertyId}`);
    return res.data?.data || res.data;
  },
};
