'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Building2, AlertCircle } from 'lucide-react';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { propertyService } from '@/services/property.service';
import { Property } from '@/types/property.types';
import { ROUTES } from '@/constants/routes';

interface FeaturedPropertiesProps {
  properties?: Property[];
  onPropertyClick?: (id: string) => void;
}

export function FeaturedProperties({
  properties: propProperties,
  onPropertyClick,
}: FeaturedPropertiesProps) {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Fetch real properties from Neon PostgreSQL backend API GET /api/properties
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: () => propertyService.getProperties({ limit: 8 }),
    enabled: !propProperties || propProperties.length === 0,
  });

  const fetchedProperties = responseData?.data || [];

  const properties =
    propProperties && propProperties.length > 0
      ? propProperties
      : fetchedProperties;

  const handleFavoriteToggle = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Featured <span className="text-[#E91E63]">Properties</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 font-normal">
              Discover verified rental properties from trusted landlords across Bangladesh.
            </p>
          </div>

          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#E91E63] hover:text-[#D81B60] transition-colors group"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 font-medium">Loading properties...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="h-6 w-full bg-gray-200 rounded pt-4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
            <h3 className="text-base font-bold text-[#1F2937]">Failed to load properties</h3>
            <p className="text-xs text-gray-500">
              Unable to connect to the property server. Please make sure the backend is running.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && properties.length === 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937]">No properties available</h3>
            <p className="text-xs text-gray-500">
              There are currently no active rental properties listed in the database.
            </p>
            <Link
              href="/dashboard/add-property"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors"
            >
              Add First Listing
            </Link>
          </div>
        )}

        {/* Responsive 4-Column Grid with Real Database Properties */}
        {!isLoading && !isError && properties.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {properties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard
                  property={property}
                  isFavorite={favoriteIds.includes(property.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={onPropertyClick || ((id) => router.push(ROUTES.PROPERTY_DETAILS(id)))}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
