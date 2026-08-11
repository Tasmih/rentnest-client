import { create } from 'zustand';
import { Property } from '@/types/property.types';

interface PropertyStore {
  properties: Property[];
  selectedProperty: Property | null;
  featuredProperties: Property[];
  isLoading: boolean;
  error: string | null;

  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  setFeaturedProperties: (properties: Property[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  selectedProperty: null,
  featuredProperties: [],
  isLoading: false,
  error: null,

  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  setFeaturedProperties: (featuredProperties) => set({ featuredProperties }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearState: () =>
    set({
      properties: [],
      selectedProperty: null,
      featuredProperties: [],
      isLoading: false,
      error: null,
    }),
}));
