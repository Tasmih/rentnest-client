'use client';

import React from 'react';
import { AlertCircle, RefreshCw, LucideIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

export interface DataLoaderProps {
  isLoading: boolean;
  isError?: boolean;
  error?: Error | unknown;
  isEmpty?: boolean;
  skeleton?: React.ReactNode;
  emptyState?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyButtonText?: string;
  onEmptyButtonAction?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DataLoader({
  isLoading,
  isError = false,
  error,
  isEmpty = false,
  skeleton,
  emptyState,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no items to display at this time.',
  emptyIcon,
  emptyButtonText,
  onEmptyButtonAction,
  onRetry,
  children,
  className = '',
}: DataLoaderProps) {
  // 1. Loading state
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <div className={`p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-xs font-semibold text-gray-400">Loading details...</p>
      </div>
    );
  }

  // 2. Error state
  if (isError) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch data from server.';
    return (
      <div className={`rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-4 shadow-sm ${className}`}>
        <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#1F2937]">Unable to load data</h3>
          <p className="text-xs text-gray-500 font-normal leading-relaxed">{errorMsg}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] rounded-xl transition-colors shadow-md shadow-rose-500/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Empty state
  if (isEmpty) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        buttonText={emptyButtonText}
        buttonAction={onEmptyButtonAction}
        className={className}
      />
    );
  }

  // 4. Success state
  return <>{children}</>;
}
