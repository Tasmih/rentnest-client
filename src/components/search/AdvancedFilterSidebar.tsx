'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  MapPin,
  Building2,
  BanknoteIcon,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Bed,
  Bath,
} from 'lucide-react';
import { PropertyFilterParams, PropertyType } from '@/types/property.types';

export interface FilterState {
  area: string;
  propertyType: PropertyType | '';
  minRent: string;
  maxRent: string;
  bedrooms: string;
  bathrooms: string;
  sortOrder: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}

interface AdvancedFilterSidebarProps {
  initialFilters: Partial<PropertyFilterParams>;
  onApply: (filters: Partial<PropertyFilterParams> & { sortOrder?: string; bedrooms?: string; bathrooms?: string }) => void;
  onReset: () => void;
}

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Flat', value: 'FLAT' },
  { label: 'Room', value: 'ROOM' },
  { label: 'Seat', value: 'SEAT' },
  { label: 'Sublet', value: 'SUBLET' },
  { label: 'Hostel', value: 'HOSTEL' },
];

const RENT_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Any Price' },
  { label: 'Under 10,000', min: 0, max: 10000 },
  { label: '10,000 – 25,000', min: 10000, max: 25000 },
  { label: '25,000 – 50,000', min: 25000, max: 50000 },
  { label: '50,000+', min: 50000 },
];

const BEDROOM_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1 Bed', value: '1' },
  { label: '2 Beds', value: '2' },
  { label: '3 Beds', value: '3' },
  { label: '4+ Beds', value: '4' },
];

const BATHROOM_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
];

const SORT_OPTIONS: { label: string; value: FilterState['sortOrder'] }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price Low to High', value: 'price_asc' },
  { label: 'Price High to Low', value: 'price_desc' },
];

export function AdvancedFilterSidebar({
  initialFilters,
  onApply,
  onReset,
}: AdvancedFilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [local, setLocal] = useState<FilterState>({
    area: initialFilters.area || '',
    propertyType: (initialFilters.propertyType as PropertyType) || '',
    minRent: initialFilters.minRent !== undefined ? initialFilters.minRent.toString() : '',
    maxRent: initialFilters.maxRent !== undefined ? initialFilters.maxRent.toString() : '',
    bedrooms: (initialFilters as any).bedrooms?.toString() || '',
    bathrooms: (initialFilters as any).bathrooms?.toString() || '',
    sortOrder: 'newest',
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync state if parent props change externally
  useEffect(() => {
    setLocal((prev) => ({
      ...prev,
      area: initialFilters.area || '',
      propertyType: (initialFilters.propertyType as PropertyType) || '',
      minRent: initialFilters.minRent !== undefined ? initialFilters.minRent.toString() : '',
      maxRent: initialFilters.maxRent !== undefined ? initialFilters.maxRent.toString() : '',
      bedrooms: (initialFilters as any).bedrooms?.toString() || '',
      bathrooms: (initialFilters as any).bathrooms?.toString() || '',
    }));
  }, [initialFilters.area, initialFilters.propertyType, initialFilters.minRent, initialFilters.maxRent]);

  const activeFilterCount = [
    local.area,
    local.propertyType,
    local.minRent,
    local.maxRent,
    local.bedrooms,
    local.bathrooms,
  ].filter(Boolean).length;

  const buildAndApply = useCallback(
    (state: FilterState) => {
      const params: Partial<PropertyFilterParams> & { sortOrder?: string; bedrooms?: string; bathrooms?: string } = {};
      if (state.area.trim()) params.area = state.area.trim();
      if (state.propertyType) params.propertyType = state.propertyType as PropertyType;
      if (state.minRent !== '' && !isNaN(Number(state.minRent))) params.minRent = Number(state.minRent);
      if (state.maxRent !== '' && !isNaN(Number(state.maxRent))) params.maxRent = Number(state.maxRent);
      if (state.bedrooms) params.bedrooms = state.bedrooms;
      if (state.bathrooms) params.bathrooms = state.bathrooms;
      params.sortOrder = state.sortOrder;
      onApply(params);
    },
    [onApply]
  );

  // Trigger filter application
  const triggerApply = (newState: FilterState) => {
    setLocal(newState);
    buildAndApply(newState);
  };

  // Debounced typing for area search input
  const handleAreaChange = (val: string) => {
    const updated = { ...local, area: val };
    setLocal(updated);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      buildAndApply(updated);
    }, 300);
  };

  const handleApplyClick = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    buildAndApply(local);
    setMobileOpen(false);
  };

  const handleResetClick = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const resetState: FilterState = {
      area: '',
      propertyType: '',
      minRent: '',
      maxRent: '',
      bedrooms: '',
      bathrooms: '',
      sortOrder: 'newest',
    };
    setLocal(resetState);
    onReset();
    setMobileOpen(false);
  };

  const applyRentPreset = (min?: number, max?: number) => {
    const newState: FilterState = {
      ...local,
      minRent: min !== undefined ? min.toString() : '',
      maxRent: max !== undefined ? max.toString() : '',
    };
    triggerApply(newState);
  };

  const filterContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#E91E63]" />
          <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider">Filter Properties</h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E91E63] text-[10px] font-extrabold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Filter Body (Never cut off) */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5">
        {/* 1. Location / Area */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <MapPin className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Location / Area
          </label>
          <input
            type="text"
            value={local.area}
            onChange={(e) => handleAreaChange(e.target.value)}
            placeholder="e.g. Mirpur, Gulshan, Uttara..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1F2937] placeholder:text-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* 2. Property Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <Building2 className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => triggerApply({ ...local, propertyType: '' })}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                !local.propertyType
                  ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All Types
            </button>
            {PROPERTY_TYPES.map((pt) => {
              const isSel = local.propertyType === pt.value;
              return (
                <button
                  key={pt.value}
                  onClick={() =>
                    triggerApply({
                      ...local,
                      propertyType: isSel ? '' : pt.value,
                    })
                  }
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all flex items-center justify-between ${
                    isSel
                      ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span>{pt.label}</span>
                  {isSel && <CheckCircle2 className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Rent Range */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <BanknoteIcon className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Monthly Rent (৳)
          </label>

          <div className="flex flex-col gap-1">
            {RENT_PRESETS.map((preset) => {
              const isActive =
                (preset.min === undefined && preset.max === undefined && local.minRent === '' && local.maxRent === '') ||
                (local.minRent === (preset.min !== undefined ? preset.min.toString() : '') &&
                 local.maxRent === (preset.max !== undefined ? preset.max.toString() : ''));

              return (
                <button
                  key={preset.label}
                  onClick={() => applyRentPreset(preset.min, preset.max)}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-rose-50 text-[#E91E63] border border-rose-200 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <span>{preset.label}</span>
                  {isActive && <CheckCircle2 className="h-3 w-3 text-[#E91E63]" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Min ৳</label>
              <input
                type="number"
                value={local.minRent}
                onChange={(e) => {
                  const updated = { ...local, minRent: e.target.value };
                  setLocal(updated);
                  buildAndApply(updated);
                }}
                placeholder="0"
                min={0}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Max ৳</label>
              <input
                type="number"
                value={local.maxRent}
                onChange={(e) => {
                  const updated = { ...local, maxRent: e.target.value };
                  setLocal(updated);
                  buildAndApply(updated);
                }}
                placeholder="Any"
                min={0}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 4. Bedrooms */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <Bed className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-1">
            {BEDROOM_OPTIONS.map((opt) => {
              const isActive = local.bedrooms === opt.value;
              return (
                <button
                  key={opt.label}
                  onClick={() => triggerApply({ ...local, bedrooms: opt.value })}
                  className={`flex-1 min-w-[45px] rounded-xl px-2 py-1 text-xs font-semibold border transition-all text-center ${
                    isActive
                      ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bathrooms */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <Bath className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Bathrooms
          </label>
          <div className="flex flex-wrap gap-1">
            {BATHROOM_OPTIONS.map((opt) => {
              const isActive = local.bathrooms === opt.value;
              return (
                <button
                  key={opt.label}
                  onClick={() => triggerApply({ ...local, bathrooms: opt.value })}
                  className={`flex-1 min-w-[45px] rounded-xl px-2 py-1 text-xs font-semibold border transition-all text-center ${
                    isActive
                      ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Sort By */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <ChevronDown className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Sort By
          </label>
          <div className="relative">
            <select
              value={local.sortOrder}
              onChange={(e) =>
                triggerApply({
                  ...local,
                  sortOrder: e.target.value as FilterState['sortOrder'],
                })
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Action Buttons Footer (Always docked at bottom, never cut off) */}
      <div className="p-4 border-t border-gray-100 space-y-2 shrink-0 bg-white">
        <button
          onClick={handleApplyClick}
          className="w-full rounded-xl bg-[#E91E63] py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-[#D81B60] transition-colors"
        >
          Apply Filters
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetClick}
            className="w-full rounded-xl border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-colors relative"
      >
        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E91E63] text-[9px] font-extrabold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sticky Sidebar Container (Task 1: sticky top-[100px], max-h-[calc(100vh-120px)]) */}
      <aside className="hidden lg:flex flex-col w-[300px] shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden sticky top-[100px] max-h-[calc(100vh-120px)]">
        {filterContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:hidden flex flex-col"
            >
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
