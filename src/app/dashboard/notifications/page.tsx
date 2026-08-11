'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  MailOpen,
  BellOff,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { notificationService, NotificationItem } from '@/services/notification.service';
import { showToast } from '@/components/ui/toastConfig';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  // Fetch user notifications GET /api/notifications
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const notifications: NotificationItem[] = data?.notifications || [];
  const unreadCount: number = data?.unreadCount || 0;

  // Mark Single as Read
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: any) => {
      showToast.error(err?.message || 'Failed to mark notification as read');
    },
  });

  // Mark All as Read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      showToast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: any) => {
      showToast.error(err?.message || 'Failed to mark notifications as read');
    },
  });

  // Delete Notification
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      showToast.success('Notification deleted');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: any) => {
      showToast.error(err?.message || 'Failed to delete notification');
    },
  });

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'UNREAD') return !item.isRead;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
            <Bell className="h-3.5 w-3.5" />
            <span>Activity Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Stay informed with real-time updates regarding your rental requests and property listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 border border-teal-200 text-[#0EA5A4] hover:bg-teal-100 transition-colors shadow-sm"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            title="Refresh Inbox"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'UNREAD'
                ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
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
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load notifications</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredNotifications.length === 0 && (
        <EmptyState
          title="No notifications to display"
          description="You are all caught up! New alerts regarding rental applications or reviews will appear here."
          icon={BellOff}
        />
      )}

      {/* Notifications List */}
      {!isLoading && !isError && filteredNotifications.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !item.isRead ? 'bg-rose-50/20' : 'hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !item.isRead ? 'bg-rose-100 text-[#E91E63]' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Bell className="h-5 w-5" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1F2937]">{item.title}</h3>
                    {!item.isRead && (
                      <span className="rounded-full bg-[#E91E63] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-gray-400 font-medium block pt-0.5">
                    {new Date(item.createdAt).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                {!item.isRead && (
                  <button
                    onClick={() => markAsReadMutation.mutate(item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-teal-200 text-[#0EA5A4] bg-teal-50 hover:bg-teal-100 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}

                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-rose-200 text-[#E91E63] bg-rose-50 hover:bg-rose-100 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
