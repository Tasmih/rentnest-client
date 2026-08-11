'use client';

import React, { useState } from 'react';
import { MapPin, Building2, DollarSign, Search } from 'lucide-react';
import { PropertyType } from '@/types/property.types';

export interface SearchBarValues {
  location: string;
  category: string;
  budget: string;
}

interface SearchBarProps {
  initialValues?: Partial<SearchBarValues>;
  onSearch?: (values: SearchBarValues) => void;
  className?: string;
}

export function SearchBar({ initialValues, onSearch, className = '' }: SearchBarProps) {
  const [location, setLocation] = useState(initialValues?.location || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [budget, setBudget] = useState(initialValues?.budget || '');

  const propertyCategories: { value: PropertyType | ''; label: string }[] = [
    { value: '', label: 'All Categories' },
    { value: 'FLAT', label: 'Flat / Apartment' },
    { value: 'ROOM', label: 'Single Room' },
    { value: 'SEAT', label: 'Seat' },
    { value: 'SUBLET', label: 'Sublet' },
    { value: 'HOSTEL', label: 'Hostel' },
  ];

  const budgetRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-10000', label: 'Under 10,000 BDT/mo' },
    { value: '10000-25000', label: '10,000 - 25,000 BDT/mo' },
    { value: '25000-50000', label: '25,000 - 50,000 BDT/mo' },
    { value: '50000+', label: '50,000+ BDT/mo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ location, category, budget });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full rounded-2xl bg-white/95 p-3 sm:p-4 shadow-xl backdrop-blur-xl ring-1 ring-black/5 transition-all duration-300 ${className}`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
        {/* Field 1: Area / Location */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-[#E91E63]">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-location" className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Location / Area
            </label>
            <input
              id="search-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mirpur, Gulshan, Uttara"
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1F2937] placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Field 2: Property Category */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-[#0EA5A4]">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-category" className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Property Type
            </label>
            <select
              id="search-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-xs sm:text-sm font-medium text-[#1F2937] focus:outline-none"
            >
              {propertyCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 3: Rent Budget Range */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-budget" className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Rent Range
            </label>
            <select
              id="search-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-xs sm:text-sm font-medium text-[#1F2937] focus:outline-none"
            >
              {budgetRanges.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 4: Search Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E91E63] hover:bg-[#D81B60] px-5 font-semibold text-white shadow-md shadow-rose-500/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Search className="h-4.5 w-4.5" />
            <span className="text-sm">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
