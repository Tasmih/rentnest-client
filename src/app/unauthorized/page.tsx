'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldX, LockKeyhole, Home, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="min-h-[80vh] w-full bg-[#FAFAFA] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-3xl bg-white p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 relative overflow-hidden"
        >
          {/* Ambient Background Radial Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E91E63]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#0EA5A4]/10 rounded-full blur-3xl pointer-events-none" />

          {/* 1 & 2. Icon Badge & Error Code 403 */}
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E91E63] shadow-sm">
                <ShieldX className="h-10 w-10" />
              </div>
              <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-[#1F2937] text-white flex items-center justify-center shadow-sm">
                <LockKeyhole className="h-3.5 w-3.5" />
              </div>
            </div>

            <span className="text-6xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-[#E91E63] via-rose-500 to-[#0EA5A4] bg-clip-text text-transparent">
              403
            </span>
          </div>

          {/* 3 & 4. Heading & Description */}
          <div className="space-y-2 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Access Denied
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-sm mx-auto">
              You don&apos;t have permission to access this page.
            </p>
          </div>

          {/* 5 & 6. Primary ("Back to Home") & Secondary ("Go Back") Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full relative z-10">
            <Link href="/" className="w-full sm:w-auto">
              <PrimaryButton
                size="md"
                fullWidth
                icon={<Home className="h-4 w-4" />}
                className="rounded-xl font-bold shadow-md shadow-rose-500/20 text-xs sm:text-sm"
              >
                Back to Home
              </PrimaryButton>
            </Link>

            <SecondaryButton
              size="md"
              variant="outline"
              fullWidth
              onClick={() => router.back()}
              icon={<ArrowLeft className="h-4 w-4" />}
              className="w-full sm:w-auto rounded-xl text-xs sm:text-sm font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </SecondaryButton>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
