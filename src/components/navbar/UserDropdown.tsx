'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LayoutDashboard,
  FileText,
  Heart,
  Building2,
  Users,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { User as UserType } from '@/types/user.types';
import { ROUTES } from '@/constants/routes';
import { showToast } from '@/components/ui/toastConfig';

interface UserDropdownProps {
  user: UserType;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user.name?.split(' ')[0] || 'User';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
    showToast.success('Logged out successfully');
    window.location.href = ROUTES.HOME;
  };

  // Role-specific dropdown menu items (Lucide icons only, NO emojis)
  const renderMenuItems = () => {
    switch (user.role) {
      case 'TENANT':
        return (
          <>
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-400 group-hover:text-[#E91E63]" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span>Profile Settings</span>
            </Link>
            <Link
              href="/dashboard/my-requests"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 text-gray-400" />
              <span>My Requests</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.SAVED}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <Heart className="h-4 w-4 text-gray-400" />
              <span>Favorites</span>
            </Link>
          </>
        );

      case 'LANDLORD':
        return (
          <>
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span>Profile Settings</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.MY_PROPERTIES}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <Building2 className="h-4 w-4 text-gray-400" />
              <span>My Properties</span>
            </Link>
            <Link
              href="/dashboard/rental-requests"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 text-gray-400" />
              <span>Rental Requests</span>
            </Link>
          </>
        );

      case 'ADMIN':
        return (
          <>
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-400" />
              <span>Admin Dashboard</span>
            </Link>
            <Link
              href="/dashboard/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <Users className="h-4 w-4 text-gray-400" />
              <span>Manage Users</span>
            </Link>
            <Link
              href="/dashboard/properties"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#E91E63] rounded-lg transition-colors"
            >
              <Building2 className="h-4 w-4 text-gray-400" />
              <span>Manage Properties</span>
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      {/* Hello, {firstName} Greeting text */}
      <span className="hidden md:inline-block text-sm font-medium text-gray-700">
        Hello, <span className="font-semibold text-[#1F2937]">{firstName}</span>
      </span>

      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full p-1 pl-1 border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:outline-none"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border border-gray-100"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-[#E91E63] font-semibold text-xs shadow-inner">
            <User className="h-4 w-4 text-[#E91E63]" />
          </div>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 pr-0.5 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-56 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 divide-y divide-gray-100"
          >
            {/* User Info Header */}
            <div className="px-3.5 py-2.5">
              <p className="text-sm font-bold text-[#1F2937] truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-[#E91E63] capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>

            {/* Navigation Options */}
            <div className="py-1 space-y-0.5">
              {renderMenuItems()}
            </div>

            {/* Logout Action */}
            <div className="pt-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3.5 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
