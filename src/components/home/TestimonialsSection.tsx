'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { RatingStars } from '@/components/review/RatingStars';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatarLetter: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Tanvir Hossain',
    role: 'Verified Tenant',
    rating: 5,
    comment: 'Finding an apartment in Mirpur used to take weeks of hassle. On RentNest, I filtered by budget, contacted the owner directly, and moved in within 3 days!',
    avatarLetter: 'T',
    location: 'Mirpur 10, Dhaka',
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    role: 'Verified Landlord',
    rating: 5,
    comment: 'Managing my rental requests became so simple. I can view tenant profiles, review their proposed move-in dates, and accept requests with a single click.',
    avatarLetter: 'N',
    location: 'Gulshan 2, Dhaka',
  },
  {
    id: '3',
    name: 'Rahim Uddin',
    role: 'Verified Tenant',
    rating: 5,
    comment: 'The transparent pricing and genuine property photos made all the difference. No hidden agent fees or fake listings. Highly recommended!',
    avatarLetter: 'R',
    location: 'Dhanmondi, Dhaka',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
            <Quote className="h-3.5 w-3.5" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Loved by tenants & landlords
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Read authentic feedback from verified members of the RentNest community.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl bg-[#FAFAFA] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RatingStars rating={item.rating} size="sm" />
                  <Quote className="h-5 w-5 text-gray-300" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-200/60 pt-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-[#E91E63] font-extrabold text-sm flex items-center justify-center">
                  {item.avatarLetter}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] flex items-center gap-1">
                    {item.name}
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0EA5A4]" />
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {item.role} • {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
