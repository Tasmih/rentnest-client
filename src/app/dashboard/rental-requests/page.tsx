'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileCheck,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { rentalService } from '@/services/rental.service';
import { formatCurrency } from '@/utils/format';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';

export default function LandlordRentalRequestsPage() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch landlord's received rental requests
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['landlordRentalRequests'],
    queryFn: () => rentalService.getLandlordRentalRequests(),
  });

  // Accept Mutation
  const acceptMutation = useMutation({
    mutationFn: (id: string) => rentalService.acceptRentalRequest(id),
    onMutate: (id) => setProcessingId(id),
    onSuccess: () => {
      showToast.success('Rental request accepted successfully!');
      queryClient.invalidateQueries({ queryKey: ['landlordRentalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to accept rental request';
      showToast.error(msg);
    },
    onSettled: () => setProcessingId(null),
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => rentalService.rejectRentalRequest(id),
    onMutate: (id) => setProcessingId(id),
    onSuccess: () => {
      showToast.success('Rental request rejected');
      queryClient.invalidateQueries({ queryKey: ['landlordRentalRequests'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to reject rental request';
      showToast.error(msg);
    },
    onSettled: () => setProcessingId(null),
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
            Pending Action
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3 py-1 text-xs font-semibold text-[#0EA5A4] mb-2">
            <FileCheck className="h-3.5 w-3.5" />
            <span>Landlord Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Received Rental Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review and manage rental applications submitted by interested tenants for your properties.
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 shadow-sm animate-pulse"
              >
                <div className="h-6 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
            <h3 className="text-base font-bold text-[#1F2937]">Failed to load applications</h3>
            <p className="text-xs text-gray-500">
              Unable to retrieve rental applications from the server.
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
              <h3 className="text-lg font-bold text-[#1F2937]">No rental requests received</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                When tenants express interest in your listed properties, their applications will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Landlord Rental Requests List */}
        {!isLoading && !isError && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Section: Tenant & Property Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-400">
                      Applied on {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Tenant Info */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                        Applicant Info
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <User className="h-4 w-4 text-[#E91E63]" />
                        <span className="font-bold text-gray-900">{item.tenant?.name || 'Tenant'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span>{item.tenant?.email}</span>
                      </div>
                      {item.tenant?.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-[#0EA5A4]" />
                          <span>{item.tenant.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                        Target Property
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] line-clamp-1">
                        {item.property?.title}
                      </h4>
                      <p className="text-xs text-[#E91E63] font-extrabold">
                        {formatCurrency(item.property?.rent || 0)}/mo
                      </p>
                      {item.moveInDate && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5 text-[#0EA5A4]" />
                          <span>Move-in: {new Date(item.moveInDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.message && (
                    <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100 flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <p className="italic">"{item.message}"</p>
                    </div>
                  )}
                </div>

                {/* Right Section: Accept / Reject Action Buttons */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0 md:flex-col sm:flex-row w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button
                      onClick={() => acceptMutation.mutate(item.id)}
                      disabled={processingId === item.id}
                      className="flex-1 md:w-32 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => rejectMutation.mutate(item.id)}
                      disabled={processingId === item.id}
                      className="flex-1 md:w-32 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4 text-[#E91E63]" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
