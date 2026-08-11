'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantClasses = {
    primary: 'bg-[#FCE4EC] text-[#E91E63] font-semibold border border-[#E91E63]/20',
    secondary: 'bg-[#1F2937] text-white font-medium',
    accent: 'bg-[#CCFBF1] text-[#0EA5A4] font-semibold border border-[#0EA5A4]/20',
    outline: 'bg-white text-gray-700 border border-gray-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
