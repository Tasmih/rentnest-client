'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Heart,
  Globe,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1F2937] text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#D81B60] flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Rent<span className="text-[#E91E63]">Nest</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-sm">
              Bangladesh&apos;s leading digital real estate marketplace. Discover verified rental apartments, rooms, sublets, and hostels with transparent pricing and direct landlord contact.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-[#0EA5A4]">
                <Globe className="h-3.5 w-3.5" />
                <span>Verified Marketplace</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#E91E63] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PROPERTIES} className="hover:text-[#E91E63] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E91E63] transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#E91E63] transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dashboard */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Dashboard</h4>
            <ul className="space-y-2 text-xs font-medium text-gray-300">
              <li>
                <Link href="/dashboard" className="hover:text-[#E91E63] transition-colors">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard/favorites" className="hover:text-[#E91E63] transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-requests" className="hover:text-[#E91E63] transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link href="/dashboard/add-property" className="hover:text-[#E91E63] transition-colors">
                  Add Property
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-[#E91E63] transition-colors">
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Contact Us</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0EA5A4] shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E91E63] shrink-0" />
                <span>support@rentnest.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0EA5A4] shrink-0" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300 font-normal">
          <p>© {currentYear} RentNest. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed for seamless renting with</span>
            <Heart className="h-3.5 w-3.5 fill-[#E91E63] text-[#E91E63]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
