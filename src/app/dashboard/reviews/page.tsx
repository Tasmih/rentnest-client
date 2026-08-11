'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  MessageSquare,
  Building2,
  Trash2,
  Pencil,
  ShieldAlert,
  AlertCircle,
  X,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { reviewService, ReviewItem } from '@/services/review.service';
import { propertyService } from '@/services/property.service';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { RatingStars } from '@/components/review/RatingStars';
import { ROUTES } from '@/constants/routes';

import { usePathname, useRouter } from 'next/navigation';

// Aggregated review with property info attached
interface AggregatedReview extends ReviewItem {
  propertyTitle?: string;
  propertyId?: string;
}

export default function DashboardReviewsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;

  const [editingReview, setEditingReview] = useState<AggregatedReview | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>('');

  // ----------------------------------------------------------------
  // Fetch user's properties (Landlord/Admin) or all properties (Tenant)
  // ----------------------------------------------------------------
  const { data: myProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['myPropertiesForReviews', user?.id, role],
    queryFn: async () => {
      if (role === 'LANDLORD' || role === 'ADMIN') {
        return propertyService.getMyProperties(user!.id);
      }
      // Tenants: fetch a general property list (up to 100) to find reviews they wrote
      const result = await propertyService.getProperties({ limit: 100 } as any);
      return result.data;
    },
    enabled: Boolean(user?.id),
  });

  // ----------------------------------------------------------------
  // Fetch reviews for all properties, then filter by role
  // ----------------------------------------------------------------
  const {
    data: allReviews = [],
    isLoading: reviewsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['dashboardAllReviews', myProperties.map((p) => p.id).join(',')],
    queryFn: async (): Promise<AggregatedReview[]> => {
      if (myProperties.length === 0) return [];

      const results = await Promise.allSettled(
        myProperties.map((prop) =>
          reviewService.getPropertyReviews(prop.id).then((reviews) =>
            reviews.map((r) => ({
              ...r,
              propertyTitle: prop.title,
              propertyId: prop.id,
            }))
          )
        )
      );

      const aggregated: AggregatedReview[] = [];
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          aggregated.push(...result.value);
        }
      });

      // Landlord/Admin: show all reviews on their properties
      // Tenant: filter to only reviews they wrote
      if (role === 'TENANT') {
        return aggregated.filter((r) => r.user?.id === user?.id);
      }
      return aggregated;
    },
    enabled: myProperties.length > 0,
  });

  const isLoading = propertiesLoading || reviewsLoading;

  // ----------------------------------------------------------------
  // Delete Review Mutation
  // ----------------------------------------------------------------
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      showToast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['dashboardAllReviews'] });
      queryClient.invalidateQueries({ queryKey: ['propertyReviews'] });
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || 'Failed to delete review');
    },
  });

  // ----------------------------------------------------------------
  // Update Review Mutation
  // ----------------------------------------------------------------
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { rating?: number; comment?: string } }) =>
      reviewService.updateReview(id, payload),
    onSuccess: () => {
      showToast.success('Review updated');
      setEditingReview(null);
      queryClient.invalidateQueries({ queryKey: ['dashboardAllReviews'] });
      queryClient.invalidateQueries({ queryKey: ['propertyReviews'] });
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || 'Failed to update review');
    },
  });

  const handleOpenEdit = (review: AggregatedReview) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    updateMutation.mutate({
      id: editingReview.id,
      payload: { rating: editRating, comment: editComment.trim() || undefined },
    });
  };

  // ----------------------------------------------------------------
  // Auth Guard
  // ----------------------------------------------------------------
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Authentication Required</h2>
          <p className="text-xs text-gray-500">Please log in to access your reviews.</p>
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ratings & Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            {role === 'TENANT' ? 'My Submitted Reviews' : 'Tenant Reviews Received'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {role === 'TENANT'
              ? 'Manage all reviews and ratings you submitted on rental properties.'
              : 'All tenant feedback and ratings left on your active property listings.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          </button>

          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
          >
            <Building2 className="h-4 w-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      {!isLoading && allReviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-[#1F2937]">{allReviews.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">Total Reviews</p>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-amber-500">
              {(allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">Average Rating</p>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-extrabold text-[#0EA5A4]">
              {allReviews.filter((r) => r.rating >= 4).length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">Positive Reviews</p>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      )}

      {/* ── Error State ── */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-sm font-bold text-[#1F2937]">Failed to load reviews</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && allReviews.length === 0 && (
        <EmptyState
          title="No reviews yet"
          description={
            role === 'TENANT'
              ? 'Visit a property page and share your experience after your stay.'
              : 'Tenant reviews on your properties will appear here once submitted.'
          }
          icon={MessageSquare}
          buttonText={role === 'TENANT' ? 'Browse Properties' : undefined}
          buttonAction={role === 'TENANT' ? () => router.push(ROUTES.PROPERTIES) : undefined}
        />
      )}

      {/* ── Reviews List ── */}
      {!isLoading && !isError && allReviews.length > 0 && (
        <div className="space-y-4">
          {allReviews.map((rev) => {
            const isOwner = rev.user?.id === user.id;

            return (
              <div
                key={rev.id}
                className="group rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 space-y-3"
              >
                {/* Review Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-[#E91E63] font-extrabold text-sm">
                      {(rev.user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">
                        {rev.user?.name || 'Verified Tenant'}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: Stars + Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <RatingStars rating={rev.rating} size="sm" showLabel />

                    {/* Owner actions (Tenant editing their own review) */}
                    {role === 'TENANT' && isOwner && (
                      <div className="flex items-center gap-1 border-l border-gray-100 pl-2 ml-1">
                        <button
                          onClick={() => handleOpenEdit(rev)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#0EA5A4] hover:border-teal-200 hover:bg-teal-50 transition-colors"
                          title="Edit this review"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(rev.id)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg border border-rose-200 text-[#E91E63] hover:bg-rose-50 transition-colors disabled:opacity-40"
                          title="Delete this review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Badge (useful context) */}
                {rev.propertyTitle && (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    <MapPin className="h-3 w-3 text-[#0EA5A4]" />
                    <Link
                      href={`/properties/${rev.propertyId}`}
                      className="hover:text-[#E91E63] transition-colors"
                    >
                      {rev.propertyTitle}
                    </Link>
                  </div>
                )}

                {/* Comment */}
                {rev.comment ? (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 rounded-xl px-3.5 py-3 border border-gray-100 font-normal">
                    {rev.comment}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No comment provided.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Review Modal ── */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-5">
            {/* Close */}
            <button
              onClick={() => setEditingReview(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-8 border-b border-gray-100 pb-4">
              <h3 className="text-base font-extrabold text-[#1F2937]">Edit Your Review</h3>
              {editingReview.propertyTitle && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#0EA5A4]" />
                  {editingReview.propertyTitle}
                </p>
              )}
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Rating <span className="text-[#E91E63]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={editRating}
                    interactive
                    onChange={setEditRating}
                    size="lg"
                  />
                  <span className="text-xs font-bold text-gray-600 border border-gray-200 rounded-lg px-2 py-0.5 bg-gray-50">
                    {editRating} / 5
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Comment</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex-1">
                  <PrimaryButton
                    type="submit"
                    isLoading={updateMutation.isPending}
                    fullWidth
                    size="md"
                    className="rounded-xl font-semibold"
                  >
                    Save Changes
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
