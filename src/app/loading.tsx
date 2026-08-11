import React from 'react';
import { Building2, LoaderCircle } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] w-full bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {/* Brand Icon & Spinner Overlay */}
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-white border border-rose-100 shadow-lg flex items-center justify-center text-[#E91E63]">
            <Building2 className="h-8 w-8 animate-pulse text-[#E91E63]" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-[#E91E63]/20 border-t-[#E91E63] animate-spin pointer-events-none" />
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#1F2937] tracking-tight">RentNest</h3>
          <p className="text-xs font-semibold text-gray-400 flex items-center justify-center gap-1.5">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#E91E63]" />
            <span>Loading experience...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
