import api from '@/lib/axios';

export interface TenantDashboardStats {
  totalRentalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  totalFavorites: number;
}

export interface LandlordDashboardStats {
  totalPropertiesOwned: number;
  availableProperties: number;
  rentedProperties: number;
  pendingRentalRequests: number;
  acceptedRentalRequests: number;
}

export interface PropertyTypeDistribution {
  FLAT: number;
  ROOM: number;
  SEAT: number;
  SUBLET: number;
  HOSTEL: number;
}

export interface RequestStatusDistribution {
  PENDING: number;
  ACCEPTED: number;
  REJECTED: number;
}

export interface RecentActivityItem {
  id: string;
  status: string;
  createdAt: string;
  tenant?: {
    name: string;
    email: string;
  };
  property?: {
    title: string;
  };
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalAdmins?: number;
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalRentalRequests: number;
  propertyTypeDistribution?: PropertyTypeDistribution;
  requestStatusDistribution?: RequestStatusDistribution;
  recentActivity?: RecentActivityItem[];
}

export const dashboardService = {
  /**
   * Tenant Stats GET /api/dashboard/tenant
   */
  async getTenantStats(): Promise<TenantDashboardStats> {
    const res = await api.get('/dashboard/tenant');
    return res.data?.data || res.data;
  },

  /**
   * Landlord Stats GET /api/dashboard/landlord
   */
  async getLandlordStats(): Promise<LandlordDashboardStats> {
    const res = await api.get('/dashboard/landlord');
    return res.data?.data || res.data;
  },

  /**
   * Admin Stats GET /api/dashboard/admin
   */
  async getAdminStats(): Promise<AdminDashboardStats> {
    const res = await api.get('/dashboard/admin');
    return res.data?.data || res.data;
  },
};
