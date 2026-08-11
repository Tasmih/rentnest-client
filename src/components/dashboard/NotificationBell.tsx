'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Trash2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { notificationService, NotificationItem } from '@/services/notification.service';
import { showToast } from '@/components/ui/toastConfig';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications GET /api/notifications
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 15000, // Refresh every 15s
  });

  const notifications: NotificationItem[] = data?.notifications || [];
  const unreadCount: number = data?.unreadCount || 0;

  // Mark single as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      showToast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E91E63] px-1 text-[10px] font-extrabold text-white shadow-md shadow-rose-500/30 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl z-50 overflow-hidden space-y-0">
          {/* Dropdown Header */}
          <div className="flex items-center justify-between bg-gray-50/80 p-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#E91E63]" />
              <span className="text-xs font-bold text-[#1F2937]">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-[#E91E63]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="text-[11px] font-semibold text-[#0EA5A4] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <Bell className="h-8 w-8 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-[#1F2937]">No notifications yet</p>
                <p className="text-[11px] text-gray-400">You are all caught up!</p>
              </div>
            ) : (
              notifications.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                    !item.isRead ? 'bg-rose-50/30' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-[#E91E63] shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-[#1F2937] truncate">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">{item.message}</p>
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {!item.isRead && (
                      <button
                        onClick={() => markAsReadMutation.mutate(item.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-[#0EA5A4] hover:bg-teal-50"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#E91E63] hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 text-center">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E91E63] hover:underline"
            >
              <span>View all notifications</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
