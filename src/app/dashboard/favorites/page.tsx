'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  Building2,
  MapPin,
  Trash2,
  Eye,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { favoriteService, FavoriteItem } from '@/services/favorite.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/format';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { PropertyGridSkeleton } from '@/components/ui/PropertyCardSkeleton';
import { SafeImage } from '@/components/ui/SafeImage';
import { Badge } from '@/components/ui/Badge';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';

export default function FavoritesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Fetch tenant favorites GET /api/favorites/my
  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoriteService.getFavorites(),
    enabled: isAuthenticated && user?.role === 'TENANT',
  });

  // Remove Favorite Mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (propertyId: string) => favoriteService.removeFavorite(propertyId),
    onSuccess: () => {
      showToast.success('Removed from favorites');
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['tenantDashboardStats'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to remove favorite';
      showToast.error(msg);
    },
  });

  // Authorization Check
  if (!isAuthenticated || user?.role !== 'TENANT') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Tenant Workspace Only</h2>
          <p className="text-xs text-gray-500">
            Favorites and Wishlists are reserved for logged-in Tenant accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
            <Heart className="h-3.5 w-3.5 fill-[#E91E63]" />
            <span>Saved Wishlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            My Favorite Properties
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compare your saved rental properties and submit rental applications.
          </p>
        </div>

        <Link
          href={ROUTES.PROPERTIES}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 self-start sm:self-auto"
        >
          <Building2 className="h-4 w-4" />
          <span>Explore More Listings</span>
        </Link>
      </div>

      {/* Loading Skeletons */}
      {isLoading && <PropertyGridSkeleton count={3} />}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load favorites</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && favorites.length === 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
            <Heart className="h-7 w-7 fill-[#E91E63]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">Your Saved Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Click the heart icon on any property card while exploring to save listings for later.
            </p>
          </div>
          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
          >
            <span>Browse Properties</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Favorites Property Grid */}
      {!isLoading && !isError && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const prop = fav.property;
            return (
              <div
                key={fav.id}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Type Badge */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <SafeImage
                    src={prop.image || prop.coverImage}
                    alt={prop.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" size="sm">
                      {prop.type || prop.propertyType}
                    </Badge>
                  </div>

                  {/* Remove Favorite Button */}
                  <button
                    onClick={() => removeFavoriteMutation.mutate(prop.id)}
                    disabled={removeFavoriteMutation.isPending}
                    className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#E91E63] shadow-md transition-all hover:bg-rose-50 hover:scale-110 active:scale-95 disabled:opacity-50"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] line-clamp-1 group-hover:text-[#E91E63] transition-colors">
                      {prop.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-[#0EA5A4] shrink-0" />
                      <span className="truncate">{prop.location}</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                      <span className="text-lg font-extrabold text-[#1F2937]">
                        {formatCurrency(prop.price)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">/{prop.rentalPeriod || 'month'}</span>
                    </div>
                  </div>

                  {/* View Details CTA */}
                  <div className="pt-2 border-t border-gray-100">
                    <Link
                      href={ROUTES.PROPERTY_DETAILS(prop.id)}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold border border-teal-200 text-[#0EA5A4] bg-teal-50/50 hover:bg-teal-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
