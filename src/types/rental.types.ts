export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'canceled';

export interface RentalApplication {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status: ApplicationStatus;
  moveInDate: string;
  leaseTermMonths: number;
  message?: string;
  monthlyIncome?: number;
  occupantsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalApplicationPayload {
  propertyId: string;
  moveInDate: string;
  leaseTermMonths: number;
  message?: string;
  monthlyIncome?: number;
  occupantsCount?: number;
}
