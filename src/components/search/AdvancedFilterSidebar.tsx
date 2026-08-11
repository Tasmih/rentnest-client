'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { PropertyFilterParams, PropertyType } from '@/types/property.types';

// Supported backend params: area, propertyType, minRent, maxRent, categoryId
export interface FilterState {
  area: string;
  propertyType: PropertyType | '';
  minRent: string;
  maxRent: string;
  sortOrder: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}

interface AdvancedFilterSidebarProps {
  initialFilters: Partial<PropertyFilterParams>;
  onApply: (filters: Partial<PropertyFilterParams> & { sortOrder?: string }) => void;
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
  { label: 'Under ৳5,000', max: 5000 },
  { label: '৳5k – ৳10k', min: 5000, max: 10000 },
  { label: '৳10k – ৳20k', min: 10000, max: 20000 },
  { label: '৳20k – ৳40k', min: 20000, max: 40000 },
  { label: 'Above ৳40k', min: 40000 },
];

const SORT_OPTIONS: { label: string; value: FilterState['sortOrder'] }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
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
    minRent: initialFilters.minRent?.toString() || '',
    maxRent: initialFilters.maxRent?.toString() || '',
    sortOrder: 'newest',
  });

  // Sync with external filter changes (e.g., URL-driven)
  useEffect(() => {
    setLocal((prev) => ({
      ...prev,
      area: initialFilters.area || '',
      propertyType: (initialFilters.propertyType as PropertyType) || '',
      minRent: initialFilters.minRent?.toString() || '',
      maxRent: initialFilters.maxRent?.toString() || '',
    }));
  }, [initialFilters.area, initialFilters.propertyType, initialFilters.minRent, initialFilters.maxRent]);

  const activeFilterCount = [
    local.area,
    local.propertyType,
    local.minRent,
    local.maxRent,
  ].filter(Boolean).length;

  const buildAndApply = useCallback(
    (state: FilterState) => {
      const params: Partial<PropertyFilterParams> & { sortOrder?: string } = {};
      if (state.area.trim()) params.area = state.area.trim();
      if (state.propertyType) params.propertyType = state.propertyType as PropertyType;
      if (state.minRent) params.minRent = Number(state.minRent);
      if (state.maxRent) params.maxRent = Number(state.maxRent);
      params.sortOrder = state.sortOrder;
      onApply(params);
    },
    [onApply]
  );

  const handleApply = () => {
    buildAndApply(local);
    setMobileOpen(false);
  };

  const handleReset = () => {
    const reset: FilterState = {
      area: '',
      propertyType: '',
      minRent: '',
      maxRent: '',
      sortOrder: 'newest',
    };
    setLocal(reset);
    onReset();
    setMobileOpen(false);
  };

  const applyRentPreset = (min?: number, max?: number) => {
    setLocal((prev) => ({
      ...prev,
      minRent: min?.toString() || '',
      maxRent: max?.toString() || '',
    }));
  };

  // ── Sidebar Content (shared between desktop and mobile drawer) ──
  const filterContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#E91E63]" />
          <h3 className="text-sm font-extrabold text-[#1F2937]">Filters</h3>
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

      {/* Scrollable Filter Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <MapPin className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Location / Area
          </label>
          <input
            type="text"
            value={local.area}
            onChange={(e) => setLocal((prev) => ({ ...prev, area: e.target.value }))}
            placeholder="e.g. Mirpur, Gulshan, Dhanmondi..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1F2937] placeholder:text-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <Building2 className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setLocal((prev) => ({ ...prev, propertyType: '' }))}
              className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                !local.propertyType
                  ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All Types
            </button>
            {PROPERTY_TYPES.map((pt) => (
              <button
                key={pt.value}
                onClick={() =>
                  setLocal((prev) => ({
                    ...prev,
                    propertyType: prev.propertyType === pt.value ? '' : pt.value,
                  }))
                }
                className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-all flex items-center justify-between ${
                  local.propertyType === pt.value
                    ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md shadow-rose-500/20'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{pt.label}</span>
                {local.propertyType === pt.value && <CheckCircle2 className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Rent Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <BanknoteIcon className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Monthly Rent (৳)
          </label>

          {/* Quick Presets */}
          <div className="flex flex-col gap-1">
            {RENT_PRESETS.map((preset) => {
              const isActive =
                local.minRent === (preset.min?.toString() || '') &&
                local.maxRent === (preset.max?.toString() || '');
              return (
                <button
                  key={preset.label}
                  onClick={() => applyRentPreset(preset.min, preset.max)}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-[#E91E63] border border-rose-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Range Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Min ৳</label>
              <input
                type="number"
                value={local.minRent}
                onChange={(e) => setLocal((prev) => ({ ...prev, minRent: e.target.value }))}
                placeholder="0"
                min={0}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Max ৳</label>
              <input
                type="number"
                value={local.maxRent}
                onChange={(e) => setLocal((prev) => ({ ...prev, maxRent: e.target.value }))}
                placeholder="Any"
                min={0}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
            <ChevronDown className="h-3.5 w-3.5 text-[#0EA5A4]" />
            Sort By
          </label>
          <div className="relative">
            <select
              value={local.sortOrder}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  sortOrder: e.target.value as FilterState['sortOrder'],
                }))
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
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

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={handleApply}
          className="w-full rounded-xl bg-[#E91E63] py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-[#D81B60] transition-colors"
        >
          Apply Filters
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
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
      {/* ── Mobile Toggle Button ── */}
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

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden sticky top-24 max-h-[calc(100vh-120px)]">
        {filterContent}
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
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
