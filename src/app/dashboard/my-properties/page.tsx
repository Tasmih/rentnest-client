'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  MapPin,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { PropertyGridSkeleton } from '@/components/ui/PropertyCardSkeleton';
import { SafeImage } from '@/components/ui/SafeImage';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';

export default function MyPropertiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch logged-in landlord properties GET /api/properties?landlordId={user.id}
  const {
    data: properties = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['myProperties', user?.id],
    queryFn: () => propertyService.getMyProperties(user?.id || ''),
    enabled: Boolean(user?.id),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => {
      showToast.success('Property deleted successfully');
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete property';
      showToast.error(msg);
      setDeleteId(null);
    },
  });

  // Authorization Check
  if (!isAuthenticated || (user?.role !== 'LANDLORD' && user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Access Restricted</h2>
          <p className="text-xs text-gray-500">
            Only verified Landlords and Administrators can manage property listings.
          </p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors"
          >
            Log In as Landlord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-2">
              <Building2 className="h-3.5 w-3.5" />
              <span>Landlord Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              My Property Listings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your published rental homes, edit pricing, or remove inactive listings.
            </p>
          </div>

          <Link
            href="/dashboard/add-property"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Listing</span>
          </Link>
        </div>

        {/* Loading State Skeletons */}
        {isLoading && <PropertyGridSkeleton count={3} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
            <h3 className="text-base font-bold text-[#1F2937]">Failed to load properties</h3>
            <p className="text-xs text-gray-500">
              Unable to connect to the property server. Please try again.
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
          <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">No property listings yet</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                You have not posted any rental property listings yet. Click below to add your first property.
              </p>
            </div>
            <Link
              href="/dashboard/add-property"
              className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
            >
              Add First Property
            </Link>
          </div>
        )}

        {/* Landlord Property Grid */}
        {!isLoading && !isError && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <SafeImage
                    src={property.image || property.coverImage}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <Badge variant="secondary" size="sm">
                      {property.type}
                    </Badge>
                    <Badge variant={property.status === 'AVAILABLE' ? 'accent' : 'secondary'} size="sm">
                      {property.status}
                    </Badge>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] line-clamp-1 group-hover:text-[#E91E63] transition-colors">
                      {property.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-[#0EA5A4] shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                      <span className="text-lg font-extrabold text-[#1F2937]">
                        {formatCurrency(property.price)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">/{property.rentalPeriod || 'month'}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                    <Link
                      href={`/dashboard/my-properties/${property.id}/edit`}
                      className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 text-gray-500" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      href={ROUTES.PROPERTY_DETAILS(property.id)}
                      className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border border-teal-200 text-[#0EA5A4] bg-teal-50/50 hover:bg-teal-100/60 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => setDeleteId(property.id)}
                      className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border border-rose-200 text-[#E91E63] bg-rose-50/50 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100">
              <div className="h-12 w-12 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-[#1F2937]">Delete Property Listing?</h3>
                <p className="text-xs text-gray-500">
                  This action cannot be undone. The property listing will be permanently removed.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
