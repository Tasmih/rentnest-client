'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiMapPin, HiStar } from 'react-icons/hi2';
import { Property } from '@/types/property.types';
import { formatCurrency, formatArea } from '@/utils/format';
import { Badge } from './Badge';

export interface PropertyCardProps {
  property: Partial<Property>;
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
  const primaryImage =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.isPrimary)?.url || property.images[0].url
      : '/placeholder-property.jpg';

  const locationText = property.address
    ? `${property.address.city || ''}, ${property.address.state || ''}`.replace(/^,\s*/, '')
    : 'Location Unavailable';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => property.id && onClick?.(property.id)}
      className={`group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={primaryImage}
          alt={property.title || 'Property Image'}
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

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (property.id) onFavoriteToggle?.(property.id);
          }}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95"
          aria-label="Toggle favorite"
        >
          <HiHeart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'fill-[#E91E63] text-[#E91E63]' : 'text-gray-600 hover:text-[#E91E63]'
            }`}
          />
        </button>
      </div>

      {/* Details Container */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#E91E63] transition-colors">
          {property.title || 'Untitled Property'}
        </h3>

        {/* Address */}
        <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <HiMapPin className="h-3.5 w-3.5 shrink-0 text-[#0EA5A4]" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* Key Metrics (Bedrooms, Bathrooms, Area) */}
        <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-600 border-t border-gray-100 pt-3">
          {property.bedrooms !== undefined && <span>{property.bedrooms} Beds</span>}
          <span className="text-gray-300">•</span>
          {property.bathrooms !== undefined && <span>{property.bathrooms} Baths</span>}
          <span className="text-gray-300">•</span>
          {property.areaSquareFeet !== undefined && (
            <span>{formatArea(property.areaSquareFeet)} sqft</span>
          )}
        </div>

        {/* Footer: Price */}
        <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-3">
          <div>
            <span className="text-lg font-extrabold text-[#1F2937]">
              {property.price ? formatCurrency(property.price) : '$0'}
            </span>
            <span className="text-xs font-medium text-gray-500">
              /{property.rentalPeriod || 'monthly'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
