'use client';

import React, { useState } from 'react';
import {
  HiMapPin,
  HiHomeModern,
  HiCurrencyDollar,
  HiMagnifyingGlass,
} from 'react-icons/hi2';

export interface SearchBarValues {
  location: string;
  category: string;
  budget: string;
}

interface SearchBarProps {
  onSearch?: (values: SearchBarValues) => void;
  className?: string;
}

export function SearchBar({ onSearch, className = '' }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');

  const propertyCategories = [
    { value: '', label: 'All Categories' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'studio', label: 'Studio' },
    { value: 'townhouse', label: 'Townhouse' },
  ];

  const budgetRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-1000', label: 'Under $1,000/mo' },
    { value: '1000-2500', label: '$1,000 - $2,500/mo' },
    { value: '2500-5000', label: '$2,500 - $5,000/mo' },
    { value: '5000+', label: '$5,000+/mo' },
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
      className={`w-full rounded-2xl bg-white/95 p-3 sm:p-4 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 transition-all duration-300 ${className}`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
        {/* Field 1: Location */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100/80 text-rose-600">
            <HiMapPin className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-location" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Location
            </label>
            <input
              id="search-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, neighborhood, or address"
              className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Field 2: Property Category */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 text-amber-600">
            <HiHomeModern className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-category" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Property Type
            </label>
            <select
              id="search-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
            >
              {propertyCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 3: Budget Range */}
        <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5 transition-colors hover:bg-gray-100/80 md:col-span-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600">
            <HiCurrencyDollar className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="search-budget" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Budget Range
            </label>
            <select
              id="search-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 px-6 font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:from-rose-600 hover:to-rose-800 hover:shadow-rose-500/40 active:scale-[0.98]"
          >
            <HiMagnifyingGlass className="h-5 w-5 stroke-[2.5]" />
            <span className="text-sm">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
