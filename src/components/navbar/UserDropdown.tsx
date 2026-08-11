'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiUser,
  HiSquares2X2,
  HiDocumentText,
  HiHeart,
  HiBuildingOffice,
  HiUserGroup,
  HiArrowRightOnRectangle,
  HiChevronDown,
} from 'react-icons/hi2';
import { User } from '@/types/user.types';
import { ROUTES } from '@/constants/routes';

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    router.push(ROUTES.HOME);
  };

  const firstLetter = user.name?.charAt(0).toUpperCase() || 'U';

  // Role-specific dropdown menu items
  const renderMenuItems = () => {
    switch (user.role) {
      case 'TENANT':
        return (
          <>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiUser className="h-4 w-4 text-gray-400 group-hover:text-rose-600" />
              <span>Profile</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiSquares2X2 className="h-4 w-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/my-requests"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiDocumentText className="h-4 w-4 text-gray-400" />
              <span>My Requests</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.SAVED}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiHeart className="h-4 w-4 text-gray-400" />
              <span>Favorites</span>
            </Link>
          </>
        );

      case 'LANDLORD':
        return (
          <>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiUser className="h-4 w-4 text-gray-400" />
              <span>Profile</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiSquares2X2 className="h-4 w-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD.MY_PROPERTIES}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiBuildingOffice className="h-4 w-4 text-gray-400" />
              <span>My Properties</span>
            </Link>
            <Link
              href="/dashboard/rental-requests"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiDocumentText className="h-4 w-4 text-gray-400" />
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
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiSquares2X2 className="h-4 w-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiUserGroup className="h-4 w-4 text-gray-400" />
              <span>Manage Users</span>
            </Link>
            <Link
              href="/dashboard/properties"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <HiBuildingOffice className="h-4 w-4 text-gray-400" />
              <span>Manage Properties</span>
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full p-1 border border-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border border-gray-100"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-sm font-semibold text-white shadow-sm">
            {firstLetter}
          </div>
        )}
        <HiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 divide-y divide-gray-100"
          >
            {/* User Header Info */}
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="mt-1.5 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>

            {/* Role Links */}
            <div className="py-1">
              {renderMenuItems()}
            </div>

            {/* Logout Button */}
            <div className="pt-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <HiArrowRightOnRectangle className="h-4 w-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
