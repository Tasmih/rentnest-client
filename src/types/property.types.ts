export type PropertyType =
  | 'FLAT'
  | 'ROOM'
  | 'SEAT'
  | 'SUBLET'
  | 'HOSTEL'
  | 'apartment'
  | 'house'
  | 'villa'
  | 'condo'
  | 'studio'
  | 'townhouse';

export type PropertyStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'RENTED'
  | 'INACTIVE'
  | 'available'
  | 'rented'
  | 'pending'
  | 'maintenance';

/**
 * Exact DTO returned from Express backend endpoint GET /api/properties
 */
export interface BackendPropertyDTO {
  id: string;
  title: string;
  rent: number;
  serviceCharge?: number;
  utilityCharge?: number;
  area: string;
  address: string;
  propertyType: PropertyType;
  coverImage?: string;
  bedrooms?: number;
  bathrooms?: number;
  status: PropertyStatus;
  createdAt?: string;
}

/**
 * Clean Normalized Frontend Property Model used by UI components
 */
export interface Property {
  id: string;
  title: string;
  price: number;
  rent: number;
  location: string;
  address: string;
  type: string;
  propertyType: PropertyType;
  image: string;
  coverImage: string;
  bedrooms: number;
  bathrooms: number;
  areaSquareFeet?: number;
  status?: PropertyStatus;
  featured?: boolean;
  rentalPeriod?: string;
  createdAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyFilterParams {
  area?: string;
  propertyType?: PropertyType;
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
  // Fallback aliases
  city?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
}
