'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HiShieldCheck, HiSparkles, HiStar } from 'react-icons/hi2';
import { SearchBar, SearchBarValues } from './SearchBar';

interface HeroSectionProps {
  onSearchSubmit?: (values: SearchBarValues) => void;
}

export function HeroSection({ onSearchSubmit }: HeroSectionProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-zinc-950 py-16 md:py-24 flex items-center justify-center">
      {/* Background Radial Glow & Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/30 via-zinc-950 to-zinc-950" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Trust Pill / Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-400 backdrop-blur-md shadow-sm">
              <HiSparkles className="h-4 w-4" />
              <span>The Next Generation Real Estate Marketplace</span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:leading-[1.1]"
          >
            Find your{' '}
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              perfect home
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base text-zinc-300 sm:text-lg md:text-xl font-normal leading-relaxed"
          >
            Discover curated apartments, luxury villas, single-family houses, and cozy rooms for rent with verified landlords and transparent pricing.
          </motion.p>

          {/* Search Bar Container */}
          <motion.div variants={itemVariants} className="mt-10 w-full max-w-5xl">
            <SearchBar onSearch={onSearchSubmit} />
          </motion.div>

          {/* Trust Highlights & Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-12 border-t border-zinc-800/80 pt-8 text-zinc-400"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xl font-bold text-white sm:text-2xl">
                <span>10,000+</span>
              </div>
              <span className="text-xs sm:text-sm text-zinc-400 mt-1">Verified Properties</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xl font-bold text-white sm:text-2xl">
                <HiShieldCheck className="h-6 w-6 text-rose-400" />
                <span>100%</span>
              </div>
              <span className="text-xs sm:text-sm text-zinc-400 mt-1">Secure Landlords</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-xl font-bold text-white sm:text-2xl">
                <HiStar className="h-5 w-5 text-amber-400 fill-amber-400" />
                <span>4.9 / 5</span>
              </div>
              <span className="text-xs sm:text-sm text-zinc-400 mt-1">Tenant Satisfaction</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
