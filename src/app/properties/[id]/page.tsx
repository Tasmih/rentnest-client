'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery as useReactQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Layers,
  Heart,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Phone,
  User,
  ShieldCheck,
  AlertCircle,
  Star,
  MessageSquare,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { favoriteService } from '@/services/favorite.service';
import { reviewService, ReviewItem } from '@/services/review.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatArea } from '@/utils/format';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';
import { RentalRequestModal } from '@/components/rental/RentalRequestModal';
import { ReviewForm } from '@/components/review/ReviewForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real property details from backend API GET /api/properties/:id
  const {
    data: property,
    isLoading,
    isError,
  } = useReactQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: Boolean(id),
  });

  // Fetch tenant favorites GET /api/favorites/my
  const { data: myFavorites = [] } = useReactQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoriteService.getFavorites(),
    enabled: isAuthenticated && user?.role === 'TENANT',
  });

  // Fetch property reviews GET /api/reviews/property/:id
  const { data: reviews = [], isLoading: isReviewsLoading } = useReactQuery({
    queryKey: ['propertyReviews', id],
    queryFn: () => reviewService.getPropertyReviews(id),
    enabled: Boolean(id),
  });

  const isSavedInFavorites = myFavorites.some((fav) => fav.property.id === id);

  // Calculate Average Rating
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  // Favorite toggle mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isSavedInFavorites) {
        return favoriteService.removeFavorite(id);
      } else {
        return favoriteService.addFavorite(id);
      }
    },
    onSuccess: () => {
      showToast.success(isSavedInFavorites ? 'Removed from favorites' : 'Saved to favorites');
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['tenantDashboardStats'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update favorites';
      showToast.error(msg);
    },
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !user) {
      showToast.info('Please log in as a Tenant to save properties');
      router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(`/properties/${id}`)}`);
      return;
    }

    if (user.role === 'LANDLORD' || user.role === 'ADMIN') {
      showToast.info('Only Tenants can save properties to favorites');
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  const handleRequestRentalClick = () => {
    if (!isAuthenticated || !user) {
      showToast.info('Please log in to submit a rental request');
      router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(`/properties/${id}`)}`);
      return;
    }

    if (user.role === 'LANDLORD') {
      showToast.warning('Landlords cannot submit rental requests');
      return;
    }

    if (user.role === 'ADMIN') {
      showToast.info('Admins cannot submit rental requests');
      return;
    }

    // Role is TENANT -> Open RentalRequestModal
    setIsModalOpen(true);
  };

  // 1. Loading State UI Skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
          <div className="h-[400px] w-full bg-gray-200 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-200 rounded-2xl" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 w-full bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State UI
  if (isError || !property) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
        <EmptyState
          title="Property Unavailable"
          description="The property listing you are looking for does not exist or may have been removed."
          icon={Building2}
          buttonText="Back to All Properties"
          buttonAction={() => router.push(ROUTES.PROPERTIES)}
        />
      </div>
    );
  }

  // Images setup for gallery grid
  const allImages = property.images && property.images.length > 0
    ? property.images.map((img) => img.url)
    : [property.image || property.coverImage];

  const mainImage = allImages[selectedImageIndex] || allImages[0];
  const sideImage1 = allImages[1] || allImages[0];
  const sideImage2 = allImages[2] || allImages[1] || allImages[0];

  const isLandlordOrAdmin = user?.role === 'LANDLORD' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-6 sm:py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back Navigation & Save Favorite */}
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#E91E63] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Properties</span>
          </Link>

          {!isLandlordOrAdmin && (
            <button
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-rose-200 hover:text-[#E91E63] shadow-sm transition-all disabled:opacity-50"
            >
              <Heart className={`h-4 w-4 ${isSavedInFavorites ? 'fill-[#E91E63] text-[#E91E63]' : ''}`} />
              <span>{isSavedInFavorites ? 'Saved' : 'Save Property'}</span>
            </button>
          )}
        </div>

        {/* 1. Airbnb-Inspired Compact Image Gallery */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 shadow-sm max-h-[460px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[340px] md:h-[440px] max-h-[460px]">
            {/* Left: Main Large Image */}
            <div className="relative md:col-span-2 h-full overflow-hidden">
              <SafeImage
                src={mainImage}
                alt={property.title}
                className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10">
                <Badge variant={property.status === 'AVAILABLE' ? 'accent' : 'secondary'} size="sm">
                  {property.status}
                </Badge>
              </div>
            </div>

            {/* Right: Stacked 2 Preview Images */}
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div
                onClick={() => setSelectedImageIndex(1 % allImages.length)}
                className="relative h-full overflow-hidden cursor-pointer group"
              >
                <SafeImage
                  src={sideImage1}
                  alt="Preview 1"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div
                onClick={() => setSelectedImageIndex(2 % allImages.length)}
                className="relative h-full overflow-hidden cursor-pointer group"
              >
                <SafeImage
                  src={sideImage2}
                  alt="Preview 2"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-10 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all shadow-md ${
                    selectedImageIndex === idx
                      ? 'border-[#E91E63] scale-105'
                      : 'border-white/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <SafeImage src={imgUrl} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Header, Stats, Description, Amenities, Reviews */}
          <div className="lg:col-span-8 space-y-6">
            {/* Property Header */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-0.5 text-xs font-semibold text-[#E91E63]">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{property.type}</span>
                </span>

                {property.availableFrom && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-[#0EA5A4]" />
                    <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="h-4 w-4 shrink-0 text-[#0EA5A4]" />
                <span>{property.address || property.location}</span>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center mb-1">
                  <Bed className="h-4 w-4" />
                </div>
                <span className="text-base font-extrabold text-[#1F2937]">{property.bedrooms}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Bedrooms</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center mb-1">
                  <Bath className="h-4 w-4" />
                </div>
                <span className="text-base font-extrabold text-[#1F2937]">{property.bathrooms}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Bathrooms</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <span className="text-base font-extrabold text-[#1F2937]">
                  {formatArea(property.areaSquareFeet || 1200)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Sq Ft</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-base font-extrabold text-[#1F2937]">
                  {property.floor ? `${property.floor}th` : 'N/A'}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Floor</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 space-y-2.5">
              <h2 className="text-base font-bold text-[#1F2937]">About This Home</h2>
              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 space-y-2.5">
                <h2 className="text-base font-bold text-[#1F2937]">Amenities & Features</h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 border border-gray-200/80 px-3 py-1.5 text-xs font-semibold text-[#1F2937]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0EA5A4]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews & Ratings Section */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <h2 className="text-lg font-extrabold text-[#1F2937]">
                    {averageRating} <span className="text-xs font-bold text-gray-400">/ 5.0</span>
                  </h2>
                  <span className="text-xs font-bold text-gray-500">• {totalReviews} Reviews</span>
                </div>
              </div>

              {/* Submit Review Form for Tenant */}
              <ReviewForm propertyId={id} />

              {/* Review Cards List */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#1F2937]">Tenant Reviews</h3>

                {isReviewsLoading && (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                    ))}
                  </div>
                )}

                {!isReviewsLoading && reviews.length === 0 && (
                  <div className="p-6 rounded-xl bg-gray-50 text-center border border-gray-100 text-xs text-gray-500 space-y-1">
                    <MessageSquare className="h-6 w-6 text-gray-300 mx-auto" />
                    <p className="font-bold text-[#1F2937]">No reviews posted yet</p>
                    <p className="text-[11px]">Be the first tenant to leave a review for this property!</p>
                  </div>
                )}

                {!isReviewsLoading && reviews.length > 0 && (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-2xl bg-gray-50/70 p-4 border border-gray-100 space-y-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-[#E91E63] font-bold text-xs">
                              {rev.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[#1F2937]">{rev.user?.name || 'Verified Tenant'}</h4>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {rev.comment && (
                          <p className="text-xs text-gray-600 leading-relaxed pt-1 font-normal">
                            {rev.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Rent Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5 border border-gray-100 space-y-4">
              {/* Rent Header */}
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                    {formatCurrency(property.price)}
                  </span>
                  <span className="text-xs font-medium text-gray-500">/{property.rentalPeriod || 'month'}</span>
                </div>

                {(property.serviceCharge > 0 || property.utilityCharge > 0) && (
                  <div className="mt-2.5 space-y-1 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    {property.serviceCharge > 0 && (
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(property.serviceCharge)}/mo</span>
                      </div>
                    )}
                    {property.utilityCharge > 0 && (
                      <div className="flex justify-between">
                        <span>Utility Charge:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(property.utilityCharge)}/mo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Landlord Card */}
              {property.landlord && (
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-200/60 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Listed By Landlord
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-[#E91E63]">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1F2937]">{property.landlord.name}</h4>
                        <p className="text-[10px] text-gray-500">Verified Landlord</p>
                      </div>
                    </div>
                    {property.landlord.phone && (
                      <a
                        href={`tel:${property.landlord.phone}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-[#0EA5A4] hover:bg-teal-200 transition-colors"
                        title="Call Landlord"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {user?.role === 'LANDLORD' ? (
                  <div className="rounded-xl bg-amber-50 p-2.5 text-center border border-amber-200 text-xs font-semibold text-amber-800">
                    Landlords cannot request rentals
                  </div>
                ) : user?.role === 'ADMIN' ? (
                  <div className="rounded-xl bg-blue-50 p-2.5 text-center border border-blue-200 text-xs font-semibold text-blue-800">
                    Admin Oversight View
                  </div>
                ) : (
                  <div className="space-y-2">
                    <PrimaryButton
                      onClick={handleRequestRentalClick}
                      fullWidth
                      size="md"
                      className="rounded-xl font-semibold py-2.5 shadow-md shadow-rose-500/25 text-xs sm:text-sm"
                    >
                      Request Rental
                    </PrimaryButton>

                    <button
                      onClick={handleToggleFavorite}
                      disabled={toggleFavoriteMutation.isPending}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                        isSavedInFavorites
                          ? 'border-rose-200 bg-rose-50 text-[#E91E63]'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isSavedInFavorites ? 'fill-[#E91E63] text-[#E91E63]' : 'text-gray-500'}`} />
                      <span>{isSavedInFavorites ? 'Saved to Favorites' : 'Save Property'}</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0EA5A4]" />
                  <span>Verified Listing & Direct Contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Request Modal for Tenants */}
      <RentalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={{
          id: property.id,
          title: property.title,
          rent: property.price,
        }}
      />
    </div>
  );
}
