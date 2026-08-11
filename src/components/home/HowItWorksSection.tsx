'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Send, KeyRound } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Search Your Home',
    description: 'Explore verified apartments, rooms, hostels, and sublets by location, property type, and rent budget.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Send Rental Request',
    description: 'Select your preferred move-in date and send a digital rental application directly to the landlord.',
    icon: Send,
  },
  {
    number: '03',
    title: 'Move Into Your New Home',
    description: 'Once accepted, connect directly with the landlord to finalize lease details and move into your new home.',
    icon: KeyRound,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3.5 py-1 text-xs font-semibold text-[#0EA5A4]">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Simple 3-Step Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            How RentNest works
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Find and secure your next rental home in three simple steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative rounded-2xl bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between"
              >
                {/* Number Watermark & Icon */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E91E63]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-gray-200 tracking-wider">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-[#1F2937]">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Connection Arrow for Desktop */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
