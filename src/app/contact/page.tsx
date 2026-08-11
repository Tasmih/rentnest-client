'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

// ── Zod Form Schema ─────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate frontend submission timeout
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    showToast.success('Thank you! Your message has been sent successfully. We will get back to you shortly.');
    reset();
  };

  return (
    <main className="flex-1 w-full bg-[#FAFAFA] space-y-12 pb-16">
      {/* ── 1. Hero Section ── */}
      <section className="relative bg-[#1F2937] text-white py-16 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-gray-800 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E91E63]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0EA5A4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold text-[#0EA5A4] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>We Are Here To Help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Get in touch with{' '}
            <span className="bg-gradient-to-r from-[#E91E63] via-rose-400 to-[#0EA5A4] bg-clip-text text-transparent">
              RentNest
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-xl mx-auto">
            Have questions about property listings, rental applications, or landlord accounts? Send us a message and our team will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── 2. Main Content: Contact Cards & Form ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Contact Info Cards (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Email */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-100 text-[#E91E63] flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Email Us</h3>
              <p className="text-xs text-gray-400 font-normal">Direct support inbox</p>
            </div>
            <a
              href="mailto:support@rentnest.com"
              className="inline-block text-xs font-bold text-[#E91E63] hover:underline"
            >
              support@rentnest.com
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-11 w-11 rounded-2xl bg-teal-50 border border-teal-100 text-[#0EA5A4] flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Call Us</h3>
              <p className="text-xs text-gray-400 font-normal">Sun – Thu, 9 AM – 6 PM</p>
            </div>
            <a
              href="tel:+8801700000000"
              className="inline-block text-xs font-bold text-[#0EA5A4] hover:underline"
            >
              +880 1700-000000
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Office Location</h3>
              <p className="text-xs text-gray-400 font-normal">Headquarters</p>
            </div>
            <p className="text-xs font-bold text-[#1F2937]">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* Form Container (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Info / Guarantee */}
          <div className="lg:col-span-5 rounded-3xl bg-[#1F2937] text-white p-8 sm:p-10 space-y-6 border border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E91E63]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Customer Support</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                Whether you need help finding a rental property or managing your landlord account, our support team is here to assist.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-teal-500/20 text-[#0EA5A4] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fast Response</h4>
                  <p className="text-[11px] text-gray-400">We aim to answer all inquiries within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dedicated Support</h4>
                  <p className="text-[11px] text-gray-400">Assistance for both tenants and verified landlords.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-extrabold text-[#1F2937]">Contact Form</h3>
              <p className="text-xs text-gray-500 mt-1">Fill out the details below and we will reach out to you.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Full Name <span className="text-[#E91E63]">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className={`w-full rounded-xl border bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:bg-white focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] font-semibold text-[#E91E63]">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Email Address <span className="text-[#E91E63]">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:bg-white focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] font-semibold text-[#E91E63]">{errors.email.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Subject</label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="e.g. Property Listing Inquiry"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:border-[#E91E63] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Your Message <span className="text-[#E91E63]">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Write your message or inquiry here..."
                  className={`w-full rounded-xl border bg-gray-50 p-3 text-xs sm:text-sm text-[#1F2937] placeholder:text-gray-400 focus:bg-white focus:outline-none transition-colors resize-none ${
                    errors.message ? 'border-rose-400 focus:border-rose-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] font-semibold text-[#E91E63]">{errors.message.message}</p>
                )}
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  isLoading={isSubmitting}
                  size="md"
                  className="rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
