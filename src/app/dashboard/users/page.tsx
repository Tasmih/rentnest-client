'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { adminUserService, AdminUserItem } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/toastConfig';
import { Badge } from '@/components/ui/Badge';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Fetch all users GET /api/users
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminUserService.getAllUsers(),
    enabled: user?.role === 'ADMIN',
  });

  // Block / Unblock Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'BLOCKED' }) =>
      adminUserService.updateUser(id, { status }),
    onMutate: ({ id }) => setActionProcessingId(id),
    onSuccess: (_, variables) => {
      showToast.success(`User ${variables.status === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update user status';
      showToast.error(msg);
    },
    onSettled: () => setActionProcessingId(null),
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminUserService.deleteUser(id),
    onMutate: (id) => setActionProcessingId(id),
    onSuccess: () => {
      showToast.success('User deleted successfully');
      setDeleteUserId(null);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete user';
      showToast.error(msg);
      setDeleteUserId(null);
    },
    onSettled: () => setActionProcessingId(null),
  });

  // Client-side Filter & Search logic
  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || item.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Authorization Check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-extrabold text-[#1F2937]">Admin Permission Required</h2>
          <p className="text-xs text-gray-500">
            You must be logged in as an Administrator to access user management functions.
          </p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
            <Shield className="h-3 w-3" />
            ADMIN
          </span>
        );
      case 'LANDLORD':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[10px] font-bold text-[#0EA5A4]">
            LANDLORD
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-[#E91E63]">
            TENANT
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            ACTIVE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-[#E91E63]">
            <Ban className="h-3 w-3" />
            BLOCKED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
            INACTIVE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            User Management Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage system users, moderate account statuses, and review permissions.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 shadow-sm"
          />
        </div>

        {/* Role Filter */}
        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:outline-none shadow-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="TENANT">Tenant</option>
            <option value="LANDLORD">Landlord</option>
            <option value="ADMIN">Admin</option>
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
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 shadow-sm animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full bg-gray-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load user directory</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty Filter State */}
      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <Users className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">No matching users found</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or role/status filters.
          </p>
        </div>
      )}

      {/* User Table (Desktop & Tablet) */}
      {!isLoading && !isError && filteredUsers.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">User Info</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1F2937]">
                {filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-[#E91E63] font-extrabold text-xs">
                          {item.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#1F2937]">{item.name}</p>
                          {item.phone && <p className="text-[10px] text-gray-400 font-normal">{item.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{item.email}</td>

                    {/* Role */}
                    <td className="py-3.5 px-4">{getRoleBadge(item.role)}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedUser(item)}
                          className="p-1.5 rounded-lg border border-teal-200 bg-teal-50 text-[#0EA5A4] hover:bg-teal-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Block / Unblock */}
                        {item.role !== 'ADMIN' && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: item.id,
                                status: item.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED',
                              })
                            }
                            disabled={actionProcessingId === item.id}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              item.status === 'BLOCKED'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                            title={item.status === 'BLOCKED' ? 'Unblock User' : 'Block User'}
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Delete User */}
                        {item.role !== 'ADMIN' && (
                          <button
                            onClick={() => setDeleteUserId(item.id)}
                            disabled={actionProcessingId === item.id}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-[#E91E63] hover:bg-rose-100 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 pr-8">
              <div className="h-12 w-12 rounded-full bg-rose-100 text-[#E91E63] font-bold text-lg flex items-center justify-center shrink-0">
                {selectedUser.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937]">{selectedUser.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#0EA5A4]" /> Email Address:
                </span>
                <span className="font-bold text-gray-900">{selectedUser.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" /> Phone Number:
                </span>
                <span className="font-bold text-gray-900">{selectedUser.phone || 'Not provided'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" /> Member Since:
                </span>
                <span className="font-bold text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Delete Account?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this user? The account will be marked as inactive.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteUserId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteUserId)}
                disabled={actionProcessingId === deleteUserId}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {actionProcessingId === deleteUserId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
