import { create } from 'zustand';
import { PropertyFilterParams, PropertyType } from '@/types/property.types';

interface FilterStore {
  filters: PropertyFilterParams;
  setFilter: <K extends keyof PropertyFilterParams>(key: K, value: PropertyFilterParams[K]) => void;
  setFilters: (filters: Partial<PropertyFilterParams>) => void;
  resetFilters: () => void;
}

const initialFilters: PropertyFilterParams = {
  query: '',
  city: '',
  minPrice: undefined,
  maxPrice: undefined,
  propertyType: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  amenities: [],
  page: 1,
  limit: 12,
  sortBy: 'created_desc',
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        page: key === 'page' ? (value as number) : 1, // reset page on filter change
      },
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));
