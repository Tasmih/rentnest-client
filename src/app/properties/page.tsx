'use client';

import React, { Suspense, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
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
import { SearchBar, SearchBarValues } from '@/components/search/SearchBar';
import { AdvancedFilterSidebar } from '@/components/search/AdvancedFilterSidebar';
import { parseSearchBarToQueryParams } from '@/utils/filterUtils';
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

  // ── Sync filters → URL ────────────────────────────────────────────────────
  const pushToURL = useCallback(
    (newFilters: Partial<PropertyFilterParams>) => {
      const params = new URLSearchParams();
      const merged = { ...filters, ...newFilters };
      if (merged.area) params.set('area', merged.area);
      if (merged.propertyType) params.set('propertyType', merged.propertyType);
      if (merged.minRent) params.set('minRent', String(merged.minRent));
      if (merged.maxRent) params.set('maxRent', String(merged.maxRent));
      if (merged.page && merged.page > 1) params.set('page', String(merged.page));

      const qs = params.toString();
      router.push(`/properties${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [filters, router]
  );

  // ── Sort client-side (backend doesn't have sort param) ───────────────────
  const sortProperties = (props: any[], sortOrder: string) => {
    const sorted = [...props];
    switch (sortOrder) {
      case 'price_asc':
        return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'price_desc':
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case 'oldest':
        return sorted.sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      case 'newest':
      default:
        return sorted.sort(
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
  const properties = sortProperties(rawProperties, sortOrder);
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearchSubmit = (values: SearchBarValues) => {
    const params = parseSearchBarToQueryParams(values);
    setFilters({ ...params, page: 1 });
    pushToURL({ ...params, page: 1 });
  };

  const handleSidebarApply = (
    newFilters: Partial<PropertyFilterParams> & { sortOrder?: string }
  ) => {
    const { sortOrder: so, ...rest } = newFilters;
    const merged = { ...rest, page: 1 };
    setFilters(merged);

    // Write sortOrder into URL (client-side only)
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) {
        params.set(k, String(v));
      } else {
        params.delete(k);
      }
    });
    if (so) params.set('sortOrder', so);
    else params.delete('sortOrder');
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

  const currentBudgetRange =
    filters.minRent !== undefined
      ? filters.maxRent !== undefined
        ? `${filters.minRent}-${filters.maxRent}`
        : `${filters.minRent}+`
      : '';

  // Quick property-type pill tabs
  const pillTypes: { label: string; value?: PropertyType }[] = [
    { label: 'All', value: undefined },
    { label: 'Flats', value: 'FLAT' },
    { label: 'Rooms', value: 'ROOM' },
    { label: 'Seats', value: 'SEAT' },
    { label: 'Sublets', value: 'SUBLET' },
    { label: 'Hostels', value: 'HOSTEL' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA]">
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-8 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Discover Rental Homes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Find Your Perfect Home
            </h1>
            <p className="text-sm text-gray-500">
              Browse verified rental properties with transparent pricing and direct landlord contact.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-4xl mx-auto">
            <SearchBar
              initialValues={{
                location: filters.area || '',
                category: filters.propertyType || '',
                budget: currentBudgetRange,
              }}
              onSearch={handleSearchSubmit}
            />
          </div>

          {/* Property Type Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-center">
            {pillTypes.map((cat) => {
              const isActive = filters.propertyType === cat.value;
              return (
                <button
                  key={cat.label}
                  onClick={() => {
                    setFilter('propertyType', cat.value);
                    const params = new URLSearchParams(searchParams.toString());
                    if (cat.value) params.set('propertyType', cat.value);
                    else params.delete('propertyType');
                    params.delete('page');
                    router.push(`/properties?${params.toString()}`, { scroll: false });
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content: Sidebar + Grid ──────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex gap-8 items-start">
          {/* Advanced Filter Sidebar (desktop sticky / mobile drawer) */}
          <AdvancedFilterSidebar
            initialFilters={filters}
            onApply={handleSidebarApply}
            onReset={handleSidebarReset}
          />

          {/* Right Column: Results */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Results Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <div className="lg:hidden">
                  <AdvancedFilterSidebar
                    initialFilters={filters}
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
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm animate-pulse"
                  >
                    <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-6 w-full bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}

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

            {/* Property Grid */}
            {!isLoading && !isError && properties.length > 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
