'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Maximize2, ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property.types';
import { formatCurrency, formatArea } from '@/utils/format';
import { Badge } from './Badge';
import { SafeImage } from './SafeImage';
import { useAuth } from '@/hooks/useAuth';
import { favoriteService } from '@/services/favorite.service';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';

export interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function PropertyCard({
  property,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className = '',
}: PropertyCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Favorite toggle mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        return favoriteService.removeFavorite(property.id);
      } else {
        return favoriteService.addFavorite(property.id);
      }
    },
    onSuccess: () => {
      showToast.success(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['tenantDashboardStats'] });
      if (onFavoriteToggle) onFavoriteToggle(property.id);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update favorites';
      showToast.error(msg);
    },
  });

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      showToast.info('Please log in as a Tenant to save properties');
      return;
    }

    if (user.role === 'LANDLORD' || user.role === 'ADMIN') {
      showToast.info('Only Tenants can save properties to favorites');
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  const handleCardClick = () => {
    if (!property.id) return;
    if (onClick) {
      onClick(property.id);
    } else {
      router.push(ROUTES.PROPERTY_DETAILS(property.id));
    }
  };

  const isLandlordOrAdmin = user?.role === 'LANDLORD' || user?.role === 'ADMIN';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={handleCardClick}
      className={`group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <SafeImage
          src={property.image || property.coverImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="accent" size="sm">
              Featured
            </Badge>
          </div>
        )}

        {/* Property Type Badge */}
        {property.type && (
          <div className="absolute bottom-3 left-3 z-10">
            <Badge variant="secondary" size="sm" className="capitalize backdrop-blur-md bg-opacity-80">
              {property.type}
            </Badge>
          </div>
        )}

        {/* Favorite Button (Only for Tenants / Visitors, hidden for Landlords/Admins) */}
        {!isLandlordOrAdmin && (
          <button
            onClick={handleHeartClick}
            disabled={toggleFavoriteMutation.isPending}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${
                isFavorite ? 'fill-[#E91E63] text-[#E91E63]' : 'text-gray-600 hover:text-[#E91E63]'
              }`}
            />
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-[#1F2937] line-clamp-1 group-hover:text-[#E91E63] transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0EA5A4]" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Key Metrics (Bedrooms, Bathrooms, Area) */}
          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-600 border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-gray-400" />
              {property.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-gray-400" />
              {property.bathrooms} Baths
            </span>
            {property.areaSquareFeet ? (
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                {formatArea(property.areaSquareFeet)} sqft
              </span>
            ) : null}
          </div>
        </div>

        {/* Footer: Price & View Details CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <span className="text-lg font-extrabold text-[#1F2937]">
              {formatCurrency(property.price)}
            </span>
            <span className="text-xs font-medium text-gray-500">
              /{property.rentalPeriod || 'month'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E91E63] group-hover:translate-x-0.5 transition-transform">
            View details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
