export type RentalRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CreateRentalRequestPayload {
  propertyId: string;
  message?: string;
  moveInDate?: string;
}

export interface RentalRequestPropertyInfo {
  id: string;
  title: string;
  rent: number;
  area?: string;
  address?: string;
  coverImage?: string;
}

export interface RentalRequestTenantInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface RentalRequestItem {
  id: string;
  moveInDate?: string;
  message?: string;
  status: RentalRequestStatus;
  createdAt: string;
  updatedAt?: string;
  property: RentalRequestPropertyInfo;
  tenant?: RentalRequestTenantInfo;
}
