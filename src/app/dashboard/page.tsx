'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Heart,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Home,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardHomePage() {
  const { user } = useAuth();

  const role = user?.role;

  // Tenant Stats
  const {
    data: tenantStats,
    isLoading: isTenantLoading,
    isError: isTenantError,
    refetch: refetchTenant,
  } = useQuery({
    queryKey: ['tenantDashboardStats'],
    queryFn: () => dashboardService.getTenantStats(),
    enabled: role === 'TENANT',
  });

  // Landlord Stats
  const {
    data: landlordStats,
    isLoading: isLandlordLoading,
    isError: isLandlordError,
    refetch: refetchLandlord,
  } = useQuery({
    queryKey: ['landlordDashboardStats'],
    queryFn: () => dashboardService.getLandlordStats(),
    enabled: role === 'LANDLORD',
  });

  // Admin Stats
  const {
    data: adminStats,
    isLoading: isAdminLoading,
    isError: isAdminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => dashboardService.getAdminStats(),
    enabled: role === 'ADMIN',
  });

  if (!user) {
    return null;
  }

  const isError = isTenantError || isLandlordError || isAdminError;

  const handleRetry = () => {
    if (role === 'TENANT') refetchTenant();
    if (role === 'LANDLORD') refetchLandlord();
    if (role === 'ADMIN') refetchAdmin();
  };

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-rose-50 text-[#E91E63] flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#1F2937]">Unable to load dashboard data</h2>
          <p className="text-xs text-gray-500">
            There was a problem fetching your statistics. Please check your internet connection or try again.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Tenant View
  if (role === 'TENANT') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Welcome back, {user.name}!</h1>
          <p className="text-xs text-gray-500 mt-1">Here is a quick overview of your rental applications.</p>
        </div>

        {isTenantLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Applications</span>
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{tenantStats?.totalRentalRequests || 0}</p>
              <Link href="/dashboard/my-requests" className="text-[11px] font-semibold text-[#E91E63] flex items-center gap-1 hover:underline">
                <span>View all applications</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Pending Approval</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{tenantStats?.pendingRequests || 0}</p>
              <span className="text-[11px] text-gray-400">Awaiting landlord review</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Accepted Rentals</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{tenantStats?.acceptedRequests || 0}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Approved by landlord</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Saved Favorites</span>
                <div className="h-8 w-8 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{tenantStats?.totalFavorites || 0}</p>
              <Link href="/dashboard/favorites" className="text-[11px] font-semibold text-[#0EA5A4] flex items-center gap-1 hover:underline">
                <span>View favorites</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Landlord View
  if (role === 'LANDLORD') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">Landlord Overview</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your rental portfolio and view application activity.</p>
          </div>
          <Link
            href="/dashboard/add-property"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Property</span>
          </Link>
        </div>

        {isLandlordLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">My Properties</span>
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{landlordStats?.totalPropertiesOwned || 0}</p>
              <Link href="/dashboard/my-properties" className="text-[11px] font-semibold text-[#E91E63] flex items-center gap-1 hover:underline">
                <span>Manage listings</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Active Listings</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{landlordStats?.availableProperties || 0}</p>
              <span className="text-[11px] text-gray-400">Currently available for rent</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Rented Properties</span>
                <div className="h-8 w-8 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{landlordStats?.rentedProperties || 0}</p>
              <span className="text-[11px] text-[#0EA5A4] font-medium">Occupied listings</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Pending Requests</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1F2937]">{landlordStats?.pendingRentalRequests || 0}</p>
              <Link href="/dashboard/rental-requests" className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 hover:underline">
                <span>Review applications</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Admin View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin Control Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Platform metrics and system administration summary.</p>
      </div>

      {isAdminLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Total Users</span>
              <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#1F2937]">{adminStats?.totalUsers || 0}</p>
            <div className="flex justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
              <span>Landlords: {adminStats?.totalLandlords || 0}</span>
              <span>Tenants: {adminStats?.totalTenants || 0}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Total Properties</span>
              <div className="h-8 w-8 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#1F2937]">{adminStats?.totalProperties || 0}</p>
            <div className="flex justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
              <span>Available: {adminStats?.availableProperties || 0}</span>
              <span>Rented: {adminStats?.rentedProperties || 0}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Rental Requests</span>
              <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#1F2937]">{adminStats?.totalRentalRequests || 0}</p>
            <span className="text-[11px] text-gray-400">Total platform applications</span>
          </div>
        </div>
      )}
    </div>
  );
}
