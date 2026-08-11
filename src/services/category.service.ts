import api from '@/lib/axios';

export interface Category {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export const categoryService = {
  /**
   * Fetch all property categories GET /api/categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    const rawData = response.data?.data || (Array.isArray(response.data) ? response.data : []);
    return Array.isArray(rawData) ? rawData : [];
  },

  /**
   * Fetch single category by ID GET /api/categories/:id
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data?.data || response.data;
  },

  /**
   * Admin: Create new category POST /api/categories
   */
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response = await api.post('/categories', payload);
    return response.data?.data || response.data;
  },

  /**
   * Admin: Update category PATCH /api/categories/:id
   */
  async updateCategory(id: string, payload: Partial<CreateCategoryPayload>): Promise<Category> {
    const response = await api.patch(`/categories/${id}`, payload);
    return response.data?.data || response.data;
  },

  /**
   * Admin: Delete category DELETE /api/categories/:id
   */
  async deleteCategory(id: string): Promise<boolean> {
    await api.delete(`/categories/${id}`);
    return true;
  },
};
