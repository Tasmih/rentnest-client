'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  RefreshCw,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { favoriteService } from '@/services/favorite.service';
import { useFilterStore } from '@/store/useFilterStore';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { PropertyGridSkeleton } from '@/components/ui/PropertyCardSkeleton';
import { AdvancedFilterSidebar } from '@/components/search/AdvancedFilterSidebar';
import { ROUTES } from '@/constants/routes';
import { PropertyFilterParams, PropertyType } from '@/types/property.types';
import { showToast } from '@/components/ui/toastConfig';
import { useAuth } from '@/hooks/useAuth';

// ── Reads URL params on mount to initialise filter store ──────────────────────
function URLSyncInit() {
  const searchParams = useSearchParams();
  const { setFilters } = useFilterStore();

  useEffect(() => {
    const fromURL: Partial<PropertyFilterParams> = {};
    const area = searchParams.get('area');
    const propertyType = searchParams.get('propertyType');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const page = searchParams.get('page');

    if (area) fromURL.area = area;
    if (propertyType) fromURL.propertyType = propertyType as PropertyType;
    if (minRent) fromURL.minRent = Number(minRent);
    if (maxRent) fromURL.maxRent = Number(maxRent);
    if (page) fromURL.page = Number(page);

    if (Object.keys(fromURL).length > 0) {
      setFilters(fromURL);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilter, setFilters, resetFilters } = useFilterStore();
  const { user, isAuthenticated } = useAuth();

  // ── Client-side Sort & Advanced Filters (Bedrooms/Bathrooms) ───────────────
  const processProperties = (props: any[], sortOrder: string, bedrooms?: string, bathrooms?: string) => {
    let result = [...props];

    if (bedrooms) {
      const minBeds = Number(bedrooms);
      result = result.filter((p) => (p.bedrooms ?? 0) >= minBeds);
    }

    if (bathrooms) {
      const minBaths = Number(bathrooms);
      result = result.filter((p) => (p.bathrooms ?? 0) >= minBaths);
    }

    switch (sortOrder) {
      case 'price_asc':
        return result.sort((a, b) => (a.rent ?? a.price ?? 0) - (b.rent ?? b.price ?? 0));
      case 'price_desc':
        return result.sort((a, b) => (b.rent ?? b.price ?? 0) - (a.rent ?? a.price ?? 0));
      case 'oldest':
        return result.sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      case 'newest':
      default:
        return result.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }
  };

  // ── Fetch properties ──────────────────────────────────────────────────────
  const { data: responseData, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
  });

  // ── Fetch tenant favorites for heart state ────────────────────────────────
  const { data: myFavorites = [] } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoriteService.getFavorites(),
    enabled: isAuthenticated && user?.role === 'TENANT',
  });
  const favoritePropertyIds = new Set(myFavorites.map((f) => f.property.id));

  const rawProperties = responseData?.data || [];
  const sortOrder = (searchParams.get('sortOrder') || 'newest') as string;
  const bedroomsParam = searchParams.get('bedrooms') || undefined;
  const bathroomsParam = searchParams.get('bathrooms') || undefined;
  const properties = processProperties(rawProperties, sortOrder, bedroomsParam, bathroomsParam);

  const meta = responseData?.meta;
  const currentPage = meta?.page ?? filters.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? properties.length;

  useEffect(() => {
    if (isError && error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch properties';
      showToast.error(msg);
    }
  }, [isError, error]);

  // ── Sidebar Filter Handlers ────────────────────────────────────────────────
  const handleSidebarApply = (
    newFilters: Partial<PropertyFilterParams> & { sortOrder?: string; bedrooms?: string; bathrooms?: string }
  ) => {
    const { sortOrder: so, bedrooms: bd, bathrooms: ba, ...rest } = newFilters;
    const merged = { ...rest, page: 1 };
    setFilters(merged);

    const params = new URLSearchParams(searchParams.toString());
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) {
        params.set(k, String(v));
      } else {
        params.delete(k);
      }
    });

    if (so) params.set('sortOrder', so); else params.delete('sortOrder');
    if (bd) params.set('bedrooms', bd); else params.delete('bedrooms');
    if (ba) params.set('bathrooms', ba); else params.delete('bathrooms');

    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const handleSidebarReset = () => {
    resetFilters();
    router.push('/properties', { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilter('page', newPage);
      const params = new URLSearchParams(searchParams.toString());
      if (newPage > 1) params.set('page', String(newPage));
      else params.delete('page');
      router.push(`/properties?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA]">
      {/* ── Task 1: Compact Marketplace Header (Height ~200px) ────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-0.5 text-[11px] font-semibold text-[#E91E63]">
              <Sparkles className="h-3 w-3" />
              <span>Discover Rental Homes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Find Your Perfect Home
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
              Browse verified rental properties with transparent pricing and direct landlord contact.
            </p>
          </div>
        </div>
      </div>

      {/* ── Task 2 & 4: Main Layout (300px Sidebar + 3-Col Grid with 24px Gap) ───── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex gap-6 items-start">
          {/* Left Sidebar Filter System (Top Aligned with Results Bar) */}
          <AdvancedFilterSidebar
            initialFilters={{ ...filters, ...(bedroomsParam && { bedrooms: bedroomsParam }), ...(bathroomsParam && { bathrooms: bathroomsParam }) }}
            onApply={handleSidebarApply}
            onReset={handleSidebarReset}
          />

          {/* Right Column: Results & Property Grid */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Results Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Drawer Toggle */}
                <div className="lg:hidden">
                  <AdvancedFilterSidebar
                    initialFilters={{ ...filters, ...(bedroomsParam && { bedrooms: bedroomsParam }), ...(bathroomsParam && { bathrooms: bathroomsParam }) }}
                    onApply={handleSidebarApply}
                    onReset={handleSidebarReset}
                  />
                </div>

                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  {isLoading ? (
                    <span className="text-gray-400">Loading listings...</span>
                  ) : (
                    <>
                      <span className="text-[#E91E63] font-bold text-sm">{totalCount}</span>
                      <span>properties found</span>
                      {isFetching && <RefreshCw className="h-3.5 w-3.5 text-[#0EA5A4] animate-spin" />}
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={handleSidebarReset}
                className="text-[11px] font-semibold text-gray-400 hover:text-[#E91E63] transition-colors flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Loading Skeletons */}
            {isLoading && <PropertyGridSkeleton count={6} />}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
                <SearchX className="h-10 w-10 text-[#E91E63] mx-auto" />
                <h3 className="text-sm font-bold text-[#1F2937]">Unable to load properties</h3>
                <p className="text-xs text-gray-500">Check your connection or try again.</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && properties.length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937]">No properties found</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    No listings matched your criteria. Try resetting filters to see all available properties.
                  </p>
                </div>
                <button
                  onClick={handleSidebarReset}
                  className="px-5 py-2.5 text-xs font-semibold text-[#E91E63] bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Property Grid (Task 4: 3-column grid with 24px / gap-6) */}
            {!isLoading && !isError && properties.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isFavorite={favoritePropertyIds.has(property.id)}
                      onClick={(id) => router.push(ROUTES.PROPERTY_DETAILS(id))}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6 pb-4">
                    <p className="text-xs font-semibold text-gray-500">
                      Page{' '}
                      <span className="text-[#1F2937] font-bold">{currentPage}</span> of{' '}
                      <span className="text-[#1F2937] font-bold">{totalPages}</span> ({totalCount}{' '}
                      total listings)
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              Math.abs(p - currentPage) <= 1
                          )
                          .map((pageNum, idx, arr) => {
                            const showEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
                            return (
                              <React.Fragment key={pageNum}>
                                {showEllipsis && (
                                  <span className="px-1 text-xs text-gray-400">…</span>
                                )}
                                <button
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                    currentPage === pageNum
                                      ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-[#E91E63] animate-spin" />
        </div>
      }
    >
      <URLSyncInit />
      <PropertiesContent />
    </Suspense>
  );
}
