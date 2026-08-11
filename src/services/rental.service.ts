import api from '@/lib/axios';
import {
  CreateRentalRequestPayload,
  RentalRequestItem,
} from '@/types/rental.types';

export const rentalService = {
  /**
   * Tenant: Create a new rental request for a property
   */
  async createRentalRequest(payload: CreateRentalRequestPayload): Promise<RentalRequestItem> {
    const response = await api.post('/rental-requests', payload);
    return response.data?.data || response.data;
  },

  /**
   * Tenant: Fetch own submitted rental requests
   */
  async getMyRentalRequests(): Promise<RentalRequestItem[]> {
    const response = await api.get('/rental-requests/my');
    const rawData = response.data?.data || (Array.isArray(response.data) ? response.data : []);
    return Array.isArray(rawData) ? rawData : [];
  },

  /**
   * Landlord / Admin: Fetch received rental requests for properties
   */
  async getLandlordRentalRequests(): Promise<RentalRequestItem[]> {
    const response = await api.get('/rental-requests/landlord');
    const rawData = response.data?.data || (Array.isArray(response.data) ? response.data : []);
    return Array.isArray(rawData) ? rawData : [];
  },

  /**
   * Landlord / Admin: Accept a pending rental request by ID
   */
  async acceptRentalRequest(id: string): Promise<RentalRequestItem> {
    const response = await api.patch(`/rental-requests/${id}/accept`);
    return response.data?.data || response.data;
  },

  /**
   * Landlord / Admin: Reject a pending rental request by ID
   */
  async rejectRentalRequest(id: string): Promise<RentalRequestItem> {
    const response = await api.patch(`/rental-requests/${id}/reject`);
    return response.data?.data || response.data;
  },
};
