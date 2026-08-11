'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  MapPin,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { rentalService } from '@/services/rental.service';
import { formatCurrency } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';

export default function MyRentalRequestsPage() {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['myRentalRequests'],
    queryFn: () => rentalService.getMyRentalRequests(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-[#E91E63]">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Tenant Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              My Rental Requests
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track status and history of your submitted property rental applications.
            </p>
          </div>

          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 shrink-0"
          >
            <span>Browse More Homes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm animate-pulse"
              >
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-16 w-full bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
            <h3 className="text-base font-bold text-[#1F2937]">Failed to load requests</h3>
            <p className="text-xs text-gray-500">
              Unable to retrieve your rental applications from the server.
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
        {!isLoading && !isError && requests.length === 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">No rental requests yet</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                You have not submitted any property rental applications yet. Explore available homes to apply.
              </p>
            </div>
            <Link
              href={ROUTES.PROPERTIES}
              className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
            >
              Explore Properties
            </Link>
          </div>
        )}

        {/* Rental Requests Cards Grid */}
        {!isLoading && !isError && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-[11px] font-medium text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] line-clamp-1">
                      {item.property?.title || 'Rental Property'}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0EA5A4]" />
                      <span className="truncate">{item.property?.area || 'Dhaka'}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 border border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Monthly Rent</span>
                    <span className="text-[#1F2937] font-extrabold">
                      {formatCurrency(item.property?.rent || 0)}
                    </span>
                  </div>

                  {item.message && (
                    <div className="text-xs text-gray-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100/60">
                      <span className="font-semibold text-gray-700 block mb-0.5">Your Message:</span>
                      <p className="italic line-clamp-2">"{item.message}"</p>
                    </div>
                  )}

                  {item.moveInDate && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-[#0EA5A4]" />
                      <span>Target Move-in: {new Date(item.moveInDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <Link
                    href={ROUTES.PROPERTY_DETAILS(item.property?.id || '')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E91E63] hover:text-[#D81B60] transition-colors"
                  >
                    <span>View Property Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
