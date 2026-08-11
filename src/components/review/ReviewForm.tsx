'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, ShieldAlert } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { RatingStars } from '@/components/review/RatingStars';
import { ROUTES } from '@/constants/routes';

interface ReviewFormProps {
  propertyId: string;
  onSuccessCallback?: () => void;
}

export function ReviewForm({ propertyId, onSuccessCallback }: ReviewFormProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      reviewService.createReview({
        propertyId,
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      showToast.success('Review posted successfully!');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['propertyReviews', propertyId] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit review';
      showToast.error(msg);
    },
  });

  // -- Access Guards --
  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-200/60 p-5 text-center space-y-3">
        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto" />
        <h4 className="text-xs font-bold text-[#1F2937]">Have you stayed here? Leave a review!</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Log in as a Tenant to share your experience with future renters.
        </p>
        <button
          onClick={() =>
            router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(`/properties/${propertyId}`)}`)
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
        >
          Log In to Review
        </button>
      </div>
    );
  }

  if (user.role === 'LANDLORD' || user.role === 'ADMIN') {
    return (
      <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-3.5 flex items-center justify-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
        <span className="text-xs font-semibold text-amber-800">
          Only verified Tenants can post property reviews.
        </span>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      showToast.error('Please select a rating between 1 and 5 stars');
      return;
    }
    submitReviewMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2 border-b border-gray-100 pb-3">
        <MessageSquare className="h-4 w-4 text-[#E91E63]" />
        Write a Review
      </h3>

      {/* Star Rating Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700">
          Rating <span className="text-[#E91E63]">*</span>
        </label>
        <div className="flex items-center gap-2">
          <RatingStars
            rating={rating}
            interactive
            onChange={setRating}
            size="lg"
          />
          <span className="text-xs font-bold text-gray-600 border border-gray-200 rounded-lg px-2 py-0.5 bg-gray-50">
            {rating} / 5
          </span>
        </div>
      </div>

      {/* Comment Textarea */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700">Your Feedback</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share details about the property, location, landlord communication, or amenities..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors resize-none"
        />
      </div>

      <PrimaryButton
        type="submit"
        isLoading={submitReviewMutation.isPending}
        size="md"
        className="rounded-xl font-semibold text-xs inline-flex items-center gap-1.5"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Submit Review</span>
      </PrimaryButton>
    </form>
  );
}
