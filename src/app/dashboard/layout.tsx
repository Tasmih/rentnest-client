'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Heart,
  User,
  Settings,
  Building2,
  PlusCircle,
  Users,
  FolderTree,
  BarChart3,
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserDropdown } from '@/components/navbar/UserDropdown';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { ROUTES } from '@/constants/routes';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Authentication Required</h2>
          <p className="text-xs text-gray-500">
            Please log in to access your RentNest member dashboard.
          </p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Define Navigation Items based on user role (All roles include Profile & Notifications)
  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case 'TENANT':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'My Requests', href: '/dashboard/my-requests', icon: FileText },
          { label: 'Favorites', href: '/dashboard/favorites', icon: Heart },
          { label: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
          { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { label: 'Profile', href: '/dashboard/profile', icon: User },
          { label: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'LANDLORD':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'My Properties', href: '/dashboard/my-properties', icon: Building2 },
          { label: 'Add Property', href: '/dashboard/add-property', icon: PlusCircle },
          { label: 'Rental Requests', href: '/dashboard/rental-requests', icon: FileText },
          { label: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
          { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { label: 'Profile', href: '/dashboard/profile', icon: User },
          { label: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Users', href: '/dashboard/users', icon: Users },
          { label: 'Properties', href: '/dashboard/properties', icon: Building2 },
          { label: 'Categories', href: '/dashboard/categories', icon: FolderTree },
          { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
          { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { label: 'Profile', href: '/dashboard/profile', icon: User },
          { label: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Brand & Role Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E91E63] to-rose-400 text-white font-extrabold shadow-md shadow-rose-500/20">
              RN
            </div>
            <span className="text-lg font-extrabold text-[#1F2937]">RentNest</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-2">
          <div className="rounded-xl bg-rose-50 p-3 border border-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E91E63] block">
              {user.role} Workspace
            </span>
            <span className="text-xs font-bold text-[#1F2937] truncate block mt-0.5">
              {user.name}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E91E63] text-white shadow-md shadow-rose-500/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#1F2937]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Home Return */}
      <div className="pt-4 border-t border-gray-100 space-y-1">
        <Link
          href={ROUTES.PROPERTIES}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-[#1F2937] transition-colors"
        >
          <Building2 className="h-4 w-4 text-gray-400" />
          <span>Browse Marketplace</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-[#1F2937] capitalize">
              {pathname === '/dashboard' ? 'Overview' : pathname.replace('/dashboard/', '').replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserDropdown user={user} onLogout={logout} />
          </div>
        </header>

        {/* Dashboard Body Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
