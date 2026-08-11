'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  RefreshCw,
  SearchX,
  Sparkles,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { useFilterStore } from '@/store/useFilterStore';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { SearchBar, SearchBarValues } from '@/components/search/SearchBar';
import { parseSearchBarToQueryParams } from '@/utils/filterUtils';
import { ROUTES } from '@/constants/routes';
import { PropertyType } from '@/types/property.types';
import { showToast } from '@/components/ui/toastConfig';

function PropertiesContent() {
  const router = useRouter();
  const { filters, setFilter, setFilters, resetFilters } = useFilterStore();

  // Fetch real properties from backend API GET /api/properties using exact query parameters: area, propertyType, minRent, maxRent, page, limit
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
  });

  const properties = responseData?.data || [];
  const totalCount = responseData?.meta?.total ?? properties.length;

  // Display error toast if API request fails
  useEffect(() => {
    if (isError && error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch properties from server';
      showToast.error(msg);
    }
  }, [isError, error]);

  const handleSearchSubmit = (values: SearchBarValues) => {
    const backendParams = parseSearchBarToQueryParams(values);
    setFilters(backendParams);
  };

  const categories: { label: string; value?: PropertyType }[] = [
    { label: 'All Properties', value: undefined },
    { label: 'Flats', value: 'FLAT' },
    { label: 'Rooms', value: 'ROOM' },
    { label: 'Seats', value: 'SEAT' },
    { label: 'Sublets', value: 'SUBLET' },
    { label: 'Hostels', value: 'HOSTEL' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header Section */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover Rental Homes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Find your perfect home
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Browse verified rental properties across locations with transparent pricing.
          </p>
        </div>

        {/* Search & Filter Component */}
        <div className="w-full max-w-5xl mx-auto">
          <SearchBar
            initialValues={{
              location: filters.area || '',
              category: filters.propertyType || '',
            }}
            onSearch={handleSearchSubmit}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => {
            const isSelected = filters.propertyType === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => setFilter('propertyType', cat.value)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 text-xs sm:text-sm">
          <p className="font-semibold text-gray-700">
            {isLoading ? (
              <span className="text-gray-400">Loading properties...</span>
            ) : (
              <>
                Showing <span className="text-[#E91E63] font-bold">{totalCount}</span> properties
              </>
            )}
          </p>

          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E91E63] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset filters
          </button>
        </div>

        {/* Loading State Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        )}

        {/* Error State UI */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <SearchX className="h-10 w-10 text-[#E91E63] mx-auto" />
            <h3 className="text-base font-bold text-[#1F2937]">Unable to load properties</h3>
            <p className="text-xs text-gray-500">
              Please check your connection or make sure backend API server is running.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State UI */}
        {!isLoading && !isError && properties.length === 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">No properties found</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                No rental properties matched your filter criteria. Try resetting your search filters to explore all available listings.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 text-xs font-semibold text-[#E91E63] bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Responsive Property Grid (4 cols Desktop, 2 cols Tablet, 1 col Mobile) */}
        {!isLoading && !isError && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={(id) => router.push(ROUTES.PROPERTY_DETAILS(id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center animate-pulse" />}>
      <PropertiesContent />
    </Suspense>
  );
}
