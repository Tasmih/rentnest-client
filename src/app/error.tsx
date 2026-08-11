'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for diagnostics
    console.error('Unhandled Root Error:', error);
  }, [error]);

  return (
    <main className="min-h-[80vh] w-full bg-[#FAFAFA] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-3xl bg-white p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 relative overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E91E63]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#0EA5A4]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E91E63] shadow-sm">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>

          {/* Heading & Description */}
          <div className="space-y-2 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-sm mx-auto">
              We couldn&apos;t load this page. Please try again or return home.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full relative z-10">
            <PrimaryButton
              size="md"
              fullWidth
              onClick={() => reset()}
              icon={<RefreshCw className="h-4 w-4" />}
              className="w-full sm:w-auto rounded-xl font-bold shadow-md shadow-rose-500/20 text-xs sm:text-sm"
            >
              Try Again
            </PrimaryButton>

            <Link href="/" className="w-full sm:w-auto">
              <SecondaryButton
                size="md"
                variant="outline"
                fullWidth
                icon={<Home className="h-4 w-4" />}
                className="rounded-xl text-xs sm:text-sm font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Back Home
              </SecondaryButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
