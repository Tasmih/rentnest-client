import React from 'react';
import { LoaderCircle } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'dark' | 'teal';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  const variantClasses = {
    primary: 'text-[#E91E63]',
    white: 'text-white',
    dark: 'text-[#1F2937]',
    teal: 'text-[#0EA5A4]',
  };

  return (
    <LoaderCircle
      className={`animate-spin shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    />
  );
}
