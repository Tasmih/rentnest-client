'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface PrimaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function PrimaryButton({
  children,
  isLoading = false,
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/30 ${
        disabled || isLoading
          ? 'bg-slate-300 cursor-not-allowed shadow-none'
          : 'bg-[#0F172A] hover:bg-[#1E293B] shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30'
      } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </motion.button>
  );
}
