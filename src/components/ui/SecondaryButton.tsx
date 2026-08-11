'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface SecondaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  className?: string;
}

export function SecondaryButton({
  children,
  isLoading = false,
  size = 'md',
  fullWidth = false,
  variant = 'solid',
  icon,
  className = '',
  disabled,
  ...props
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
  };

  const variantClasses = {
    solid: disabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-[#1F2937] hover:bg-[#111827] text-white shadow-sm hover:shadow-md',
    outline: disabled
      ? 'border border-gray-200 text-gray-300 cursor-not-allowed'
      : 'border border-gray-300 hover:border-gray-400 bg-white text-[#1F2937] hover:bg-gray-50',
    ghost: disabled
      ? 'text-gray-300 cursor-not-allowed'
      : 'text-[#1F2937] hover:bg-gray-100/80',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F2937]/20 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
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
