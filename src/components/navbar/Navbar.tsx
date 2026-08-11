'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building2,
  Info,
  PhoneCall,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  FileText,
  Heart,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { UserDropdown } from './UserDropdown';
import { NotificationBell } from '@/components/dashboard/NotificationBell';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hide public navbar on dashboard routes to prevent duplicate layout headers
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  // Scroll Detection for Sticky Navbar Shadow & Solid Background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: ROUTES.HOME, icon: Home },
    { label: 'Properties', href: ROUTES.PROPERTIES, icon: Building2 },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: PhoneCall },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  const handleMobileLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md border-b border-gray-100 py-0'
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200/80 py-0'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group" aria-label="RentNest Homepage">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E91E63] via-rose-500 to-[#0EA5A4] text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#1F2937] group-hover:text-[#E91E63] transition-colors">
              Rent<span className="text-[#E91E63]">Nest</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-gray-200/60 bg-gray-50/70 p-1.5 shadow-inner">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  active
                    ? 'text-[#E91E63] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth & Dashboard Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <UserDropdown user={user} onLogout={logout} />
            </div>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#E91E63] transition-colors"
              >
                Log in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="inline-flex items-center justify-center rounded-full bg-[#E91E63] hover:bg-[#D81B60] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer & Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute top-full left-0 right-0 z-50 overflow-hidden border-b border-gray-200 bg-white md:hidden shadow-2xl"
            >
              <div className="space-y-1 px-4 pt-3 pb-6">
                {/* Mobile Nav Links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        active
                          ? 'bg-rose-50 text-[#E91E63] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-[#E91E63]' : 'text-gray-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Dashboard Link for Authenticated Users */}
                {isAuthenticated && user && (
                  <Link
                    href={ROUTES.DASHBOARD.ROOT}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5 text-gray-400" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Mobile Auth / Profile Section */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-[#E91E63] font-bold">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F2937]">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleMobileLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2">
                      <Link
                        href={ROUTES.LOGIN}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-xl border border-gray-300 py-2.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        href={ROUTES.REGISTER}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-xl bg-[#E91E63] hover:bg-[#D81B60] py-2.5 text-base font-semibold text-white shadow-md transition-all"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
