'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { ROUTES } from '@/constants/routes';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      showToast.error('Email Address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast.error('Please enter a valid email address');
      return false;
    }

    if (!password) {
      showToast.error('Password is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Authenticate user with backend
      const loginData = await authService.login({ email, password });
      setAuth(loginData.user, loginData.token);

      showToast.success('Logged in successfully!');

      const returnUrl = searchParams.get('returnUrl');
      router.push(returnUrl ? decodeURIComponent(returnUrl) : ROUTES.DASHBOARD.ROOT);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-5xl w-full max-h-[calc(100vh-90px)] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center overflow-hidden">
        {/* LEFT SECTION: Marketing & Features (45% Width on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col justify-center space-y-2.5 text-left"
        >
          {/* Welcome Back Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#E91E63] w-fit">
            <Sparkles className="h-3 w-3" />
            <span>Welcome back to RentNest</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Find your next home{' '}
            <span className="text-[#E91E63]">with ease</span>
          </h1>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-gray-600 font-normal leading-relaxed max-w-md">
            Login to discover properties, manage rentals, and connect with trusted users.
          </p>

          {/* Feature List (lucide-react icons only, no emojis) */}
          <div className="space-y-2 pt-2.5 border-t border-gray-200/70">
            {/* Feature 1 */}
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-rose-100 text-[#E91E63]">
                <Search className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F2937]">Explore verified properties</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Browse verified apartments, rooms, and houses.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal-100 text-[#0EA5A4]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F2937]">Secure rental experience</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Direct communication with verified landlords.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F2937]">Manage your properties easily</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Track rental applications and active listings.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION: Compact Login Card (55% Width on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto lg:max-w-none"
        >
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-md ring-1 ring-black/5 border border-gray-100">
            <div className="mb-3 text-left">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1F2937] tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Sign in to continue to your RentNest account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Field 1: Email Address */}
              <div>
                <label htmlFor="login-email" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full h-8 rounded-lg border border-gray-200 bg-gray-50/50 pl-8 pr-3 py-1 text-xs font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label htmlFor="login-password" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-8 rounded-lg border border-gray-200 bg-gray-50/50 pl-8 pr-8 py-1 text-xs font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Primary Button (#E91E63) */}
              <div className="pt-1.5">
                <PrimaryButton
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                  size="md"
                  className="rounded-lg font-semibold py-2 text-xs"
                >
                  Sign In
                </PrimaryButton>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2.5 text-gray-400 font-medium tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Google Login Component */}
            <div className="w-full flex justify-center">
              <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-full bg-gray-100" />}>
                <GoogleLoginButton />
              </Suspense>
            </div>

            {/* Footer Navigation Link */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Don't have an account?{' '}
              <Link href={ROUTES.REGISTER} className="font-semibold text-[#E91E63] hover:text-[#D81B60] transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100vh-80px)] w-full bg-[#FAFAFA] flex items-center justify-center animate-pulse" />}>
      <LoginFormContent />
    </Suspense>
  );
}
