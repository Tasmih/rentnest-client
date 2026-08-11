import api from '@/lib/axios';

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'INACTIVE';
  createdAt: string;
  updatedAt?: string;
}

export const adminUserService = {
  /**
   * Admin: Get all users GET /api/users
   */
  async getAllUsers(): Promise<AdminUserItem[]> {
    const res = await api.get('/users');
    const rawData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return Array.isArray(rawData) ? rawData : [];
  },

  /**
   * Admin: Get user by ID GET /api/users/:id
   */
  async getUserById(id: string): Promise<AdminUserItem> {
    const res = await api.get(`/users/${id}`);
    return res.data?.data || res.data;
  },

  /**
   * Admin: Update user PATCH /api/users/:id (e.g. status: "BLOCKED" | "ACTIVE", role: "LANDLORD")
   */
  async updateUser(id: string, payload: Partial<AdminUserItem>): Promise<AdminUserItem> {
    const res = await api.patch(`/users/${id}`, payload);
    return res.data?.data || res.data;
  },

  /**
   * Admin: Soft-delete user DELETE /api/users/:id
   */
  async deleteUser(id: string): Promise<boolean> {
    await api.delete(`/users/${id}`);
    return true;
  },
};
