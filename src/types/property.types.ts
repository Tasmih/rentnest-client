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

export interface LandlordInfo {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
}

/**
 * Exact DTO returned from Express backend endpoint GET /api/properties/:id
 */
export interface BackendPropertyDTO {
  id: string;
  title: string;
  description?: string;
  rent: number;
  serviceCharge?: number;
  utilityCharge?: number;
  area: string;
  address: string;
  propertyType: PropertyType;
  floor?: number;
  totalFloors?: number;
  availableFrom?: string;
  bedrooms?: number;
  bathrooms?: number;
  coverImage?: string;
  furnished?: boolean;
  parking?: boolean;
  lift?: boolean;
  bachelorAllowed?: boolean;
  familyAllowed?: boolean;
  status: PropertyStatus;
  createdAt?: string;
  updatedAt?: string;
  category?: CategoryInfo;
  landlord?: LandlordInfo;
}

/**
 * Clean Normalized Frontend Property Model used by UI components
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rent: number;
  serviceCharge: number;
  utilityCharge: number;
  location: string;
  address: string;
  type: string;
  propertyType: PropertyType;
  image: string;
  coverImage: string;
  images: { id: string; url: string; isPrimary?: boolean }[];
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  availableFrom?: string;
  areaSquareFeet?: number;
  status: PropertyStatus;
  featured?: boolean;
  rentalPeriod?: string;
  furnished?: boolean;
  parking?: boolean;
  lift?: boolean;
  bachelorAllowed?: boolean;
  familyAllowed?: boolean;
  amenities: string[];
  category?: CategoryInfo;
  landlord?: LandlordInfo;
  createdAt?: string;
  updatedAt?: string;
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
  city?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}
