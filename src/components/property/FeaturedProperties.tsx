'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Property } from '@/types/property.types';
import { ROUTES } from '@/constants/routes';

interface FeaturedPropertiesProps {
  properties?: Property[];
  onPropertyClick?: (id: string) => void;
}

// Temporary local mock properties array formatted for UI preview
const MOCK_FEATURED_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Waterfront Villa',
    description: 'Stunning luxury villa featuring panoramic bay views and private pool.',
    price: 3800,
    rentalPeriod: 'monthly',
    type: 'villa',
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    areaSquareFeet: 2850,
    address: {
      street: '124 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      country: 'USA',
    },
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    amenities: [],
    landlordId: 'landlord-1',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-2',
    title: 'Skyline Penthouse Apartment',
    description: 'High-floor penthouse with floor-to-ceiling windows and luxury finishes.',
    price: 2650,
    rentalPeriod: 'monthly',
    type: 'apartment',
    status: 'available',
    bedrooms: 2,
    bathrooms: 2,
    areaSquareFeet: 1420,
    address: {
      street: '750 Grand Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90017',
      country: 'USA',
    },
    images: [
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    amenities: [],
    landlordId: 'landlord-2',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-3',
    title: 'Charming Suburban Family Home',
    description: 'Spacious family house with private garden, garage, and quiet neighborhood.',
    price: 3200,
    rentalPeriod: 'monthly',
    type: 'house',
    status: 'available',
    bedrooms: 3,
    bathrooms: 2.5,
    areaSquareFeet: 2100,
    address: {
      street: '42 Maple Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    amenities: [],
    landlordId: 'landlord-3',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-4',
    title: 'Sleek Downtown Studio Condo',
    description: 'Modern open-plan studio in the heart of downtown with resort amenities.',
    price: 1950,
    rentalPeriod: 'monthly',
    type: 'condo',
    status: 'available',
    bedrooms: 1,
    bathrooms: 1,
    areaSquareFeet: 780,
    address: {
      street: '310 5th Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    images: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    amenities: [],
    landlordId: 'landlord-4',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function FeaturedProperties({
  properties = MOCK_FEATURED_PROPERTIES,
  onPropertyClick,
}: FeaturedPropertiesProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleFavoriteToggle = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FCE4EC] px-3.5 py-1 text-xs font-semibold text-[#E91E63] mb-3">
              <HiSparkles className="h-3.5 w-3.5" />
              <span>Handpicked Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Featured <span className="text-[#E91E63]">Properties</span>
            </h2>
            <p className="mt-2 text-base text-gray-600 font-normal">
              Discover handpicked homes from trusted landlords.
            </p>
          </div>

          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#E91E63] hover:text-[#D81B60] transition-colors group"
          >
            <span>Explore All Properties</span>
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive 4-Column Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard
                property={property}
                isFavorite={favoriteIds.includes(property.id)}
                onFavoriteToggle={handleFavoriteToggle}
                onClick={onPropertyClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
