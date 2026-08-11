import { Property } from './property.types';

export interface FavoriteItem {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: string;
}

export interface FavoriteToggleResponse {
  isFavorite: boolean;
  propertyId: string;
  message: string;
}
