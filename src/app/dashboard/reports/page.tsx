'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Home,
  Bed,
  Layers,
  User,
  Shield,
  Activity,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/hooks/useAuth';

export default function AdminReportsPage() {
  const { user } = useAuth();

  // Fetch real admin dashboard stats GET /api/dashboard/admin
  const {
    data: adminStats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => dashboardService.getAdminStats(),
    enabled: user?.role === 'ADMIN',
  });

  // Authorization Check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-extrabold text-[#1F2937]">Admin Permission Required</h2>
          <p className="text-xs text-gray-500">
            You must be logged in as an Administrator to view system analytics and reports.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            ACCEPTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-[#E91E63]">
            <XCircle className="h-3 w-3" />
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            <Clock className="h-3 w-3" />
            PENDING
          </span>
        );
    }
  };

  const types = adminStats?.propertyTypeDistribution || { FLAT: 0, ROOM: 0, SEAT: 0, SUBLET: 0, HOSTEL: 0 };
  const requests = adminStats?.requestStatusDistribution || { PENDING: 0, ACCEPTED: 0, REJECTED: 0 };
  const totalProps = adminStats?.totalProperties || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Admin Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            System Reports & Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time metric breakdown for registered users, property taxonomy, and rental requests.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load analytics</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && adminStats && (
        <>
          {/* 1. Main Statistics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Users</span>
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1F2937]">{adminStats.totalUsers}</p>
              <p className="text-[11px] text-gray-400 font-medium">Registered platform accounts</p>
            </div>

            {/* Total Properties */}
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Properties</span>
                <div className="h-9 w-9 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1F2937]">{adminStats.totalProperties}</p>
              <p className="text-[11px] text-[#0EA5A4] font-medium">Listed across Dhaka</p>
            </div>

            {/* Total Rental Requests */}
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Rental Requests</span>
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1F2937]">{adminStats.totalRentalRequests}</p>
              <p className="text-[11px] text-amber-600 font-medium">Tenant applications submitted</p>
            </div>

            {/* Active Properties */}
            <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Active Properties</span>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1F2937]">{adminStats.availableProperties}</p>
              <p className="text-[11px] text-emerald-600 font-medium">Currently available for rent</p>
            </div>
          </div>

          {/* 2 & 3. User Analytics & Rental Request Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Analytics Card */}
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#E91E63]" />
                  User Role Distribution
                </h3>
                <span className="text-xs font-bold text-[#E91E63]">{adminStats.totalUsers} Total</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl bg-rose-50/60 p-4 border border-rose-100 text-center space-y-1">
                  <User className="h-4 w-4 text-[#E91E63] mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Tenants</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{adminStats.totalTenants}</p>
                </div>

                <div className="rounded-xl bg-teal-50/60 p-4 border border-teal-100 text-center space-y-1">
                  <Building2 className="h-4 w-4 text-[#0EA5A4] mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Landlords</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{adminStats.totalLandlords}</p>
                </div>

                <div className="rounded-xl bg-purple-50/60 p-4 border border-purple-100 text-center space-y-1">
                  <Shield className="h-4 w-4 text-purple-700 mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Admins</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{adminStats.totalAdmins || 1}</p>
                </div>
              </div>
            </div>

            {/* Rental Request Analytics Card */}
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0EA5A4]" />
                  Rental Application Status
                </h3>
                <span className="text-xs font-bold text-[#0EA5A4]">{adminStats.totalRentalRequests} Total</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl bg-amber-50/60 p-4 border border-amber-100 text-center space-y-1">
                  <Clock className="h-4 w-4 text-amber-600 mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Pending</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{requests.PENDING}</p>
                </div>

                <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-100 text-center space-y-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Accepted</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{requests.ACCEPTED}</p>
                </div>

                <div className="rounded-xl bg-rose-50/60 p-4 border border-rose-100 text-center space-y-1">
                  <XCircle className="h-4 w-4 text-[#E91E63] mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Rejected</span>
                  <p className="text-xl font-extrabold text-[#1F2937]">{requests.REJECTED}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Property Analytics (Property Type Distribution) */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                <Home className="h-4 w-4 text-[#E91E63]" />
                Property Type Distribution
              </h3>
              <span className="text-xs font-bold text-gray-500">{adminStats.totalProperties} Listings</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {Object.entries(types).map(([typeKey, count]) => {
                const percentage = Math.round((count / totalProps) * 100) || 0;
                return (
                  <div key={typeKey} className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1F2937]">
                      <span>{typeKey}</span>
                      <span className="text-[#E91E63]">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E91E63] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 block">{percentage}% of portfolio</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Recent Activity Section */}
          {adminStats.recentActivity && adminStats.recentActivity.length > 0 && (
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#0EA5A4]" />
                  Recent Rental Applications
                </h3>
                <span className="text-xs font-medium text-gray-400">Live Activity Feed</span>
              </div>

              <div className="space-y-3">
                {adminStats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 gap-2 hover:bg-gray-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-teal-100 text-[#0EA5A4] flex items-center justify-center font-bold text-xs shrink-0">
                        {activity.tenant?.name?.[0] || 'T'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1F2937]">
                          {activity.tenant?.name || 'Tenant'} applied for <span className="text-[#E91E63]">{activity.property?.title || 'Property'}</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{activity.tenant?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {getStatusBadge(activity.status)}
                      <span className="text-[10px] font-medium text-gray-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
