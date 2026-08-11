'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Heart,
  Globe,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on dashboard routes to prevent duplicate layout footers
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#1F2937] text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5 group" aria-label="RentNest Homepage">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#E91E63] via-rose-500 to-[#0EA5A4] flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Rent<span className="text-[#E91E63]">Nest</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-sm">
              Bangladesh&apos;s leading digital real estate marketplace. Discover verified rental apartments, rooms, sublets, and hostels with transparent pricing and direct landlord contact.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-[#0EA5A4]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Marketplace</span>
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Explore</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-300">
              <li>
                <Link href={ROUTES.PROPERTIES} className="hover:text-[#E91E63] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href={`${ROUTES.PROPERTIES}?propertyType=FLAT`} className="hover:text-[#E91E63] transition-colors">
                  Apartments & Flats
                </Link>
              </li>
              <li>
                <Link href={`${ROUTES.PROPERTIES}?propertyType=ROOM`} className="hover:text-[#E91E63] transition-colors">
                  Single Rooms
                </Link>
              </li>
              <li>
                <Link href={`${ROUTES.PROPERTIES}?propertyType=HOSTEL`} className="hover:text-[#E91E63] transition-colors">
                  Hostels & Seats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Company</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-300">
              <li>
                <Link href="/about" className="hover:text-[#E91E63] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E91E63] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E91E63] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E91E63] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Account</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-300">
              <li>
                <Link href={ROUTES.LOGIN} className="hover:text-[#E91E63] transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-[#E91E63] transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href={ROUTES.DASHBOARD.ROOT} className="hover:text-[#E91E63] transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Lucide Icons */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300 font-normal">
          <p>© {currentYear} RentNest. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1">
              <span>Designed with</span>
              <Heart className="h-3.5 w-3.5 fill-[#E91E63] text-[#E91E63]" />
            </span>
            <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
              <a
                href="https://rentnest.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors"
                aria-label="RentNest Platform Link"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@rentnest.com"
                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors"
                aria-label="Email Support"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
