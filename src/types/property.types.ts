export type PropertyType = 'apartment' | 'house' | 'villa' | 'condo' | 'studio' | 'townhouse';

export type PropertyStatus = 'available' | 'rented' | 'pending' | 'maintenance';

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rentalPeriod: 'monthly' | 'yearly';
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  areaSquareFeet: number;
  address: PropertyAddress;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  landlordId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterParams {
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'created_desc';
}
