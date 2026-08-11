'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  DollarSign,
  PlusCircle,
  ArrowLeft,
  Image as ImageIcon,
  ShieldAlert,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/hooks/useAuth';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';

// Zod Validation Schema
const addPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  rent: z.number().gt(0, 'Monthly rent must be a positive number'),
  serviceCharge: z.number().min(0),
  utilityCharge: z.number().min(0),
  area: z.string().min(2, 'Area location is required'),
  address: z.string().min(5, 'Full street address is required'),
  propertyType: z.enum(['FLAT', 'ROOM', 'SEAT', 'SUBLET', 'HOSTEL']),
  categoryId: z.string().min(1, 'Please select a category'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  floor: z.number().min(0),
  totalFloors: z.number().min(1),
  coverImage: z.string().min(1, 'Please provide an image URL or upload an image'),
  furnished: z.boolean(),
  parking: z.boolean(),
  lift: z.boolean(),
  bachelorAllowed: z.boolean(),
  familyAllowed: z.boolean(),
});

type AddPropertyFormData = z.infer<typeof addPropertySchema>;

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories from backend GET /api/categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddPropertyFormData>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      title: '',
      description: '',
      rent: 15000,
      serviceCharge: 1000,
      utilityCharge: 500,
      area: 'Gulshan',
      address: '',
      propertyType: 'FLAT',
      categoryId: '',
      bedrooms: 2,
      bathrooms: 1,
      floor: 3,
      totalFloors: 10,
      furnished: true,
      parking: true,
      lift: true,
      bachelorAllowed: false,
      familyAllowed: true,
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    },
  });

  const coverImageVal = watch('coverImage');

  // Auto-set default category when categories load
  useEffect(() => {
    if (categories.length > 0) {
      setValue('categoryId', categories[0].id);
    }
  }, [categories, setValue]);

  // Authorization Check
  if (!isAuthenticated || (user?.role !== 'LANDLORD' && user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Access Restricted</h2>
          <p className="text-xs text-gray-500">
            Only verified Landlords and Administrators can post property listings.
          </p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60] transition-colors"
          >
            Log In as Landlord
          </button>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<AddPropertyFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      await propertyService.createProperty(data);
      showToast.success('Property listing created successfully!');
      router.push('/dashboard/my-properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create property listing';
      showToast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const areas = [
    'Gulshan',
    'Banani',
    'Bashundhara R/A',
    'Dhanmondi',
    'Uttara',
    'Mirpur',
    'Mohammadpur',
    'Badda',
    'Rampura',
    'Wari',
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Landlord Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Add New Rental Property
            </h1>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E91E63] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Property Creation Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Basic Information */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#E91E63]" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Property Title *</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Modern 3-Bedroom Family Apartment"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                {errors.title && <p className="text-[11px] font-medium text-rose-500">{errors.title.message}</p>}
              </div>

              {/* Property Type */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Property Type *</label>
                <select
                  {...register('propertyType')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                >
                  <option value="FLAT">Flat / Apartment</option>
                  <option value="ROOM">Single Room</option>
                  <option value="SEAT">Seat</option>
                  <option value="SUBLET">Sublet</option>
                  <option value="HOSTEL">Hostel</option>
                </select>
                {errors.propertyType && <p className="text-[11px] font-medium text-rose-500">{errors.propertyType.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Category *</label>
                <select
                  {...register('categoryId')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-[11px] font-medium text-rose-500">{errors.categoryId.message}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Description *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe your property, nearby landmarks, and amenities..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none resize-none"
                />
                {errors.description && <p className="text-[11px] font-medium text-rose-500">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* 2. Rent & Charges */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#0EA5A4]" />
              Rent & Charges (BDT)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Monthly Rent */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Monthly Rent *</label>
                <input
                  type="number"
                  {...register('rent', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                {errors.rent && <p className="text-[11px] font-medium text-rose-500">{errors.rent.message}</p>}
              </div>

              {/* Service Charge */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Service Charge</label>
                <input
                  type="number"
                  {...register('serviceCharge', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Utility Charge */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Utility Charge</label>
                <input
                  type="number"
                  {...register('utilityCharge', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Location & Specs */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#E91E63]" />
              Location & Property Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Area */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700">Area *</label>
                <select
                  {...register('area')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {errors.area && <p className="text-[11px] font-medium text-rose-500">{errors.area.message}</p>}
              </div>

              {/* Full Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700">Street Address *</label>
                <input
                  {...register('address')}
                  placeholder="e.g. House 12, Road 4, Block C, Dhaka"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                {errors.address && <p className="text-[11px] font-medium text-rose-500">{errors.address.message}</p>}
              </div>

              {/* Bedrooms */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Bathrooms */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Floor */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Floor</label>
                <input
                  type="number"
                  {...register('floor', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Total Floors */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Total Floors</label>
                <input
                  type="number"
                  {...register('totalFloors', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Cover Image (URL or Upload) & Features */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#0EA5A4]" />
              Image & Features
            </h2>

            <div className="space-y-4">
              {/* Dual-Option Image Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Property Cover Image *
                </label>
                <ImageUploadInput
                  value={coverImageVal || ''}
                  onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
                  error={errors.coverImage?.message}
                />
              </div>

              {/* Boolean Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" {...register('furnished')} className="rounded text-[#E91E63] focus:ring-[#E91E63]" />
                  Furnished
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" {...register('parking')} className="rounded text-[#E91E63] focus:ring-[#E91E63]" />
                  Parking
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" {...register('lift')} className="rounded text-[#E91E63] focus:ring-[#E91E63]" />
                  Elevator / Lift
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" {...register('bachelorAllowed')} className="rounded text-[#E91E63] focus:ring-[#E91E63]" />
                  Bachelor Allowed
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" {...register('familyAllowed')} className="rounded text-[#E91E63] focus:ring-[#E91E63]" />
                  Family Allowed
                </label>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              fullWidth
              size="lg"
              className="rounded-xl font-semibold py-3 shadow-lg shadow-rose-500/25"
            >
              Publish Property Listing
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
