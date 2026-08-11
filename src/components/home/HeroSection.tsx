'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { HiBuildingOffice2, HiPlusCircle, HiShieldCheck, HiSparkles } from 'react-icons/hi2';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { ROUTES } from '@/constants/routes';

export function HomeHeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 pt-4 md:pt-6 pb-6">
      <section className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[65vh] lg:min-h-[70vh] lg:max-h-[70vh] w-full overflow-hidden rounded-3xl bg-[#1F2937] shadow-2xl shadow-zinc-950/25 border border-zinc-800/40 flex items-center justify-center">
        {/* Background Image with Dynamic Real Estate Contrast */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80")',
          }}
        />

        {/* Directional Gradient & Glow Overlays for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/95 via-[#1F2937]/80 to-[#1F2937]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E91E63]/25 via-transparent to-transparent" />

        {/* Hero Content Container with Expanded Max Width */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Trust Badge */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0EA5A4]/30 bg-[#0EA5A4]/15 px-4 py-1 text-xs font-semibold text-[#0EA5A4] backdrop-blur-md shadow-sm">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>Premium Real Estate Marketplace</span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.12] max-w-3xl"
            >
              Find your{' '}
              <span className="bg-gradient-to-r from-[#E91E63] via-rose-400 to-[#0EA5A4] bg-clip-text text-transparent">
                perfect home
              </span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 font-normal leading-relaxed max-w-xl"
            >
              Discover verified properties from trusted landlords with seamless booking and transparent pricing.
            </motion.p>

            {/* Two Theme-compliant CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link href={ROUTES.PROPERTIES} className="w-full sm:w-auto">
                <PrimaryButton
                  size="md"
                  fullWidth
                  icon={<HiBuildingOffice2 className="h-4 w-4" />}
                  className="sm:px-7 sm:py-3.5 sm:text-base shadow-lg shadow-[#E91E63]/25"
                >
                  Explore Properties
                </PrimaryButton>
              </Link>

              <Link href="/dashboard/add-property" className="w-full sm:w-auto">
                <SecondaryButton
                  size="md"
                  variant="outline"
                  fullWidth
                  icon={<HiPlusCircle className="h-4 w-4 text-[#0EA5A4]" />}
                  className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 hover:border-white/40 sm:px-7 sm:py-3.5 sm:text-base"
                >
                  List Your Property
                </SecondaryButton>
              </Link>
            </motion.div>

            {/* Trust Guarantee Highlights */}
            <motion.div
              variants={itemVariants}
              className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-300 border-t border-white/10 pt-4"
            >
              <div className="flex items-center gap-1.5">
                <HiShieldCheck className="h-4 w-4 text-[#0EA5A4]" />
                <span>Verified Listings</span>
              </div>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <HiShieldCheck className="h-4 w-4 text-[#E91E63]" />
                <span>Direct Landlord Contact</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Alias export for flexibility
export { HomeHeroSection as HeroSection };
