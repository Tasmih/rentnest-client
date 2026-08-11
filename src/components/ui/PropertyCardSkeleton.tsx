import React from 'react';

export interface PropertyCardSkeletonProps {
  className?: string;
}

export function PropertyCardSkeleton({ className = '' }: PropertyCardSkeletonProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-0 overflow-hidden shadow-sm flex flex-col animate-pulse ${className}`}
    >
      {/* Image Area Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gray-200">
        <div className="absolute top-3 left-3 h-5 w-16 bg-gray-300 rounded-full" />
        <div className="absolute bottom-3 left-3 h-5 w-20 bg-gray-300 rounded-full" />
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-300" />
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title Placeholder */}
          <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
          {/* Location Placeholder */}
          <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />

          {/* Metrics Row Placeholder */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="h-4 w-14 bg-gray-200 rounded" />
            <div className="h-4 w-14 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Price & CTA Footer Placeholder */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="h-6 w-24 bg-gray-200 rounded-lg" />
          <div className="h-4 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
