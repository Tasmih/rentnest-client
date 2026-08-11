'use client';

import React from 'react';
import { SearchX, LucideIcon } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  buttonText?: string;
  buttonAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  buttonText,
  buttonAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl bg-white border border-gray-100 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm ${className}`}
    >
      {/* Icon Badge */}
      <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 text-[#E91E63] flex items-center justify-center mx-auto shadow-xs">
        <Icon className="h-7 w-7" />
      </div>

      {/* Heading & Description */}
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-[#1F2937] tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      {buttonText && buttonAction && (
        <div className="pt-2">
          <PrimaryButton
            size="sm"
            onClick={buttonAction}
            className="rounded-xl text-xs font-semibold px-5 py-2 shadow-md shadow-rose-500/20"
          >
            {buttonText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
