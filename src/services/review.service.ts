import api from '@/lib/axios';

export interface ReviewUser {
  id: string;
  name: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: ReviewUser;
  userId?: string;
  propertyId?: string;
  property?: {
    id: string;
    title: string;
    coverImage?: string;
    area?: string;
  };
}

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export const reviewService = {
  /**
   * Fetch reviews for a specific property GET /api/reviews/property/:propertyId
   */
  async getPropertyReviews(propertyId: string): Promise<ReviewItem[]> {
    const res = await api.get(`/reviews/property/${propertyId}`);
    const rawData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return Array.isArray(rawData) ? rawData : [];
  },

  /**
   * Submit new review POST /api/reviews
   */
  async createReview(payload: CreateReviewPayload): Promise<ReviewItem> {
    const res = await api.post('/reviews', payload);
    return res.data?.data || res.data;
  },

  /**
   * Update existing review PATCH /api/reviews/:id
   */
  async updateReview(id: string, payload: UpdateReviewPayload): Promise<ReviewItem> {
    const res = await api.patch(`/reviews/${id}`, payload);
    return res.data?.data || res.data;
  },

  /**
   * Delete review DELETE /api/reviews/:id
   */
  async deleteReview(id: string): Promise<boolean> {
    await api.delete(`/reviews/${id}`);
    return true;
  },
};
