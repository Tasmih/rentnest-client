'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Home, Hotel, DoorOpen, Building, ArrowRight } from 'lucide-react';
import { PropertyType } from '@/types/property.types';

interface CategoryCard {
  label: string;
  type: PropertyType;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  countText: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: 'Apartment',
    type: 'FLAT',
    description: 'Self-contained 2–4 bedroom flats for families & executives.',
    icon: Building2,
    countText: 'Verified Flats',
  },
  {
    label: 'Room',
    type: 'ROOM',
    description: 'Private single or shared rooms in prime locations.',
    icon: DoorOpen,
    countText: 'Private Rooms',
  },
  {
    label: 'Hostel',
    type: 'HOSTEL',
    description: 'Student & professional hostels with shared facilities.',
    icon: Hotel,
    countText: 'Hostel Seats',
  },
  {
    label: 'Sublet',
    type: 'SUBLET',
    description: 'Short-term and furnished sublet spaces available immediately.',
    icon: Building,
    countText: 'Sublet Units',
  },
  {
    label: 'House',
    type: 'FLAT',
    description: 'Independent multi-story residential buildings and duplexe homes.',
    icon: Home,
    countText: 'Family Homes',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
              <Building2 className="h-3.5 w-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Browse by property type
            </h2>
            <p className="text-sm text-gray-500 font-normal max-w-xl">
              Find rental accommodations tailored to your budget and lifestyle preferences.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E91E63] hover:text-[#D81B60] transition-colors self-start sm:self-auto"
          >
            <span>Browse All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Link
                  href={`/properties?propertyType=${cat.type}`}
                  className="group block h-full rounded-2xl bg-[#FAFAFA] border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-white transition-all duration-200"
                >
                  <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 group-hover:border-rose-300 group-hover:bg-rose-50 flex items-center justify-center text-[#1F2937] group-hover:text-[#E91E63] transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#E91E63] transition-colors">
                          {cat.label}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {cat.countText}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 font-normal leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0EA5A4] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
