'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  DollarSign,
  Edit,
  ArrowLeft,
  Image as ImageIcon,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/hooks/useAuth';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { showToast } from '@/components/ui/toastConfig';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';

const editPropertySchema = z.object({
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
  status: z.enum(['AVAILABLE', 'RENTED', 'RESERVED', 'INACTIVE']),
});

type EditPropertyFormData = z.infer<typeof editPropertySchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Property by ID
  const {
    data: property,
    isLoading: isPropertyLoading,
    isError,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: Boolean(id),
  });

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      title: '',
      description: '',
      rent: 10000,
      serviceCharge: 0,
      utilityCharge: 0,
      area: 'Gulshan',
      address: '',
      propertyType: 'FLAT',
      categoryId: '',
      bedrooms: 1,
      bathrooms: 1,
      floor: 1,
      totalFloors: 10,
      coverImage: '',
      furnished: true,
      parking: true,
      lift: true,
      bachelorAllowed: false,
      familyAllowed: true,
      status: 'AVAILABLE',
    },
  });

  const coverImageVal = watch('coverImage');

  // Pre-fill form values when property data loads
  useEffect(() => {
    if (property) {
      const validTypes = ['FLAT', 'ROOM', 'SEAT', 'SUBLET', 'HOSTEL'] as const;
      const rawType = property.propertyType?.toUpperCase() || 'FLAT';
      const propertyType = (validTypes.includes(rawType as any) ? rawType : 'FLAT') as 'FLAT' | 'ROOM' | 'SEAT' | 'SUBLET' | 'HOSTEL';

      const validStatuses = ['AVAILABLE', 'RENTED', 'RESERVED', 'INACTIVE'] as const;
      const rawStatus = property.status?.toUpperCase() || 'AVAILABLE';
      const status = (validStatuses.includes(rawStatus as any) ? rawStatus : 'AVAILABLE') as 'AVAILABLE' | 'RENTED' | 'RESERVED' | 'INACTIVE';

      reset({
        title: property.title || '',
        description: property.description || '',
        rent: Number(property.price || property.rent || 0),
        serviceCharge: Number(property.serviceCharge || 0),
        utilityCharge: Number(property.utilityCharge || 0),
        area: property.location || property.address || 'Gulshan',
        address: property.address || '',
        propertyType,
        categoryId: property.category?.id || (categories[0]?.id || ''),
        bedrooms: Number(property.bedrooms || 1),
        bathrooms: Number(property.bathrooms || 1),
        floor: Number(property.floor || 1),
        totalFloors: Number(property.totalFloors || 10),
        coverImage: property.image || property.coverImage || '',
        furnished: property.furnished ?? true,
        parking: property.parking ?? true,
        lift: property.lift ?? true,
        bachelorAllowed: property.bachelorAllowed ?? false,
        familyAllowed: property.familyAllowed ?? true,
        status,
      });
    }
  }, [property, categories, reset]);

  // Authorization Check
  if (!isAuthenticated || (user?.role !== 'LANDLORD' && user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Access Restricted</h2>
          <p className="text-xs text-gray-500">
            Only verified Landlords can edit property listings.
          </p>
        </div>
      </div>
    );
  }

  if (isPropertyLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-xs text-gray-400 font-semibold animate-pulse">Loading property details...</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-gray-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Property Not Found</h3>
          <button
            onClick={() => router.push('/dashboard/my-properties')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<EditPropertyFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      await propertyService.updateProperty(id, data);
      showToast.success('Property updated successfully!');
      router.push('/dashboard/my-properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update property';
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
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Listing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Edit Property Listing
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

        {/* Form Card */}
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                {errors.title && <p className="text-[11px] font-medium text-rose-500">{errors.title.message}</p>}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Listing Status</label>
                <select
                  {...register('status')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="RENTED">Rented</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
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
              </div>

              {/* Category */}
              <div className="sm:col-span-2 space-y-1">
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
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Description *</label>
                <textarea
                  {...register('description')}
                  rows={3}
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
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Monthly Rent *</label>
                <input
                  type="number"
                  {...register('rent', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                {errors.rent && <p className="text-[11px] font-medium text-rose-500">{errors.rent.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Service Charge</label>
                <input
                  type="number"
                  {...register('serviceCharge', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

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
              Location & Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700">Street Address *</label>
                <input
                  {...register('address')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Floor</label>
                <input
                  type="number"
                  {...register('floor', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

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
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
