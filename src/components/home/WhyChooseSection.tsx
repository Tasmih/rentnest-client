'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Sparkles, MessageSquareLock } from 'lucide-react';

interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: ShieldCheck,
    title: 'Verified Properties',
    description: 'Every rental listing undergoes strict verification to ensure real photos, authentic addresses, and accurate pricing.',
    color: 'text-[#E91E63]',
    bgColor: 'bg-rose-50 border-rose-100',
  },
  {
    icon: UserCheck,
    title: 'Trusted Landlords',
    description: 'Directly connect with vetted property owners and managers with zero hidden agency fees or commissions.',
    color: 'text-[#0EA5A4]',
    bgColor: 'bg-teal-50 border-teal-100',
  },
  {
    icon: Sparkles,
    title: 'Easy Rental Process',
    description: 'Submit digital rental applications in 1-click, specify your move-in dates, and track your application status live.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 border-amber-100',
  },
  {
    icon: MessageSquareLock,
    title: 'Secure Communication',
    description: 'Communicate safely and receive automated notifications on application approvals and agreement updates.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-100',
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Why RentNest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Built for modern, stress-free renting
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Everything you need to discover, apply, and secure your ideal home safely.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-2xl bg-[#FAFAFA] border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div
                    className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 ${item.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#E91E63] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
