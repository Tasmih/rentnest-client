'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Search,
  ShieldAlert,
  Eye,
  Trash2,
  MapPin,
  User,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/format';
import { showToast } from '@/components/ui/toastConfig';
import { SafeImage } from '@/components/ui/SafeImage';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { Property } from '@/types/property.types';

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Fetch all properties GET /api/properties?limit=100
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminProperties'],
    queryFn: () => propertyService.getProperties({ limit: 100 }),
    enabled: user?.role === 'ADMIN',
  });

  const properties: Property[] = responseData?.data || [];

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      propertyService.updateProperty(id, { status }),
    onMutate: ({ id }) => setActionProcessingId(id),
    onSuccess: () => {
      showToast.success('Property status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update property status';
      showToast.error(msg);
    },
    onSettled: () => setActionProcessingId(null),
  });

  // Delete Property Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onMutate: (id) => setActionProcessingId(id),
    onSuccess: () => {
      showToast.success('Property listing deleted successfully');
      setDeletePropertyId(null);
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete property';
      setDeletePropertyId(null);
    },
    onSettled: () => setActionProcessingId(null),
  });

  // Search & Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.landlord?.name && item.landlord.name.toLowerCase().includes(q));

      const matchesType = typeFilter === 'ALL' || item.propertyType?.toUpperCase() === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, searchQuery, typeFilter, statusFilter]);

  // Authorization Check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-extrabold text-[#1F2937]">Admin Permission Required</h2>
          <p className="text-xs text-gray-500">
            You must be logged in as an Administrator to manage property listings.
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
            <Building2 className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Property Moderation & Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review live rental listings, update property availability, and remove inappropriate content.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties by title, area, or landlord name..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 shadow-sm"
          />
        </div>

        {/* Property Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:outline-none shadow-sm"
          >
            <option value="ALL">All Types</option>
            <option value="FLAT">Flat / Apartment</option>
            <option value="ROOM">Room</option>
            <option value="SEAT">Seat</option>
            <option value="SUBLET">Sublet</option>
            <option value="HOSTEL">Hostel</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:outline-none shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="RENTED">Rented</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 shadow-sm animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full bg-gray-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load properties</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProperties.length === 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">No matching properties found</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or type/status filters.
          </p>
        </div>
      )}

      {/* Admin Property Table */}
      {!isLoading && !isError && filteredProperties.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Landlord</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Rent</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1F2937]">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-rose-50/20 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          <SafeImage
                            src={property.image || property.coverImage}
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="max-w-[200px] truncate">
                          <p className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">{property.title}</p>
                          <span className="text-[10px] text-gray-400 font-normal">ID: {property.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>

                    {/* Landlord */}
                    <td className="py-3.5 px-4 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{property.landlord?.name || 'Landlord N/A'}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" size="sm">
                        {property.propertyType || property.type}
                      </Badge>
                    </td>

                    {/* Area */}
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#0EA5A4] shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </td>

                    {/* Rent */}
                    <td className="py-3.5 px-4 font-extrabold text-[#1F2937] text-xs">
                      {formatCurrency(property.price)}
                    </td>

                    {/* Status Dropdown Quick Change */}
                    <td className="py-3.5 px-4">
                      <select
                        value={property.status || 'AVAILABLE'}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: property.id,
                            status: e.target.value,
                          })
                        }
                        disabled={actionProcessingId === property.id}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-bold uppercase transition-colors ${
                          property.status === 'AVAILABLE'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : property.status === 'RENTED'
                            ? 'border-teal-200 bg-teal-50 text-[#0EA5A4]'
                            : property.status === 'RESERVED'
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-gray-200 bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="RENTED">RENTED</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Property Details */}
                        <Link
                          href={ROUTES.PROPERTY_DETAILS(property.id)}
                          className="p-1.5 rounded-lg border border-teal-200 bg-teal-50 text-[#0EA5A4] hover:bg-teal-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>

                        {/* Delete Property */}
                        <button
                          onClick={() => setDeletePropertyId(property.id)}
                          disabled={actionProcessingId === property.id}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-[#E91E63] hover:bg-rose-100 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletePropertyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Delete Property Listing?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this property listing? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletePropertyId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletePropertyId)}
                disabled={actionProcessingId === deletePropertyId}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {actionProcessingId === deletePropertyId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
