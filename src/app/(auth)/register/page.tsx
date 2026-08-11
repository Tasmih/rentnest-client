'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '@/types/user.types';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('TENANT');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!name.trim()) {
      showToast.error('Full Name is required');
      return false;
    }

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

    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return false;
    }

    if (!role) {
      showToast.error('Please select an account type');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Register new user with backend
      await authService.register({
        name,
        email,
        password,
        role,
      });

      // Automatically log in newly registered user
      const loginData = await authService.login({ email, password });
      setAuth(loginData.user, loginData.token);

      showToast.success('Account created successfully!');
      router.push(ROUTES.DASHBOARD.ROOT);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] w-full bg-[#FAFAFA] flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-5xl w-full max-h-[calc(100vh-85px)] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center overflow-hidden">
        {/* LEFT SECTION: Marketing & Features (Strictly Compact Height) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col justify-center space-y-2 text-left"
        >
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#E91E63] w-fit">
            <Sparkles className="h-3 w-3" />
            <span>Welcome to RentNest</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Find your perfect home or{' '}
            <span className="text-[#E91E63]">list your property</span>
          </h1>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-gray-600 font-normal leading-relaxed max-w-md">
            RentNest makes renting and listing simple, safe, and seamless for everyone.
          </p>

          {/* Feature List */}
          <div className="space-y-2 pt-2 border-t border-gray-200/70">
            {/* Feature 1 */}
            <div className="flex items-start gap-2">
              <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded bg-rose-100 text-[#E91E63]">
                <Search className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#1F2937]">Find the perfect place</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Explore thousands of verified properties.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-2">
              <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded bg-teal-100 text-[#0EA5A4]">
                <ShieldCheck className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#1F2937]">Trusted & secure</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Verified listings and secure renting experience.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-2">
              <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
                <Building2 className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#1F2937]">List & grow</h3>
                <p className="text-[10px] text-gray-500 leading-tight">List your property and reach more tenants.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION: Ultra-Compact Registration Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto lg:max-w-none"
        >
          <div className="rounded-2xl bg-white p-3.5 sm:p-5 shadow-md ring-1 ring-black/5 border border-gray-100">
            <div className="mb-1.5 text-left">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1F2937] tracking-tight">
                Create your account
              </h2>
              <p className="text-[10px] text-gray-500 font-normal">
                Fill in the details below to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-1.5">
              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="register-name" className="block text-[9px] font-semibold uppercase tracking-wider text-gray-600 mb-0.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <User className="h-3 w-3" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-7 rounded-md border border-gray-200 bg-gray-50/50 pl-7 pr-2.5 text-[11px] font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
              </div>

              {/* Field 2: Email Address */}
              <div>
                <label htmlFor="register-email" className="block text-[9px] font-semibold uppercase tracking-wider text-gray-600 mb-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <Mail className="h-3 w-3" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full h-7 rounded-md border border-gray-200 bg-gray-50/50 pl-7 pr-2.5 text-[11px] font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div>
                <label htmlFor="register-password" className="block text-[9px] font-semibold uppercase tracking-wider text-gray-600 mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <Lock className="h-3 w-3" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-7 rounded-md border border-gray-200 bg-gray-50/50 pl-7 pr-7 text-[11px] font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Field 4: Confirm Password */}
              <div>
                <label htmlFor="register-confirm-password" className="block text-[9px] font-semibold uppercase tracking-wider text-gray-600 mb-0.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <Lock className="h-3 w-3" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-7 rounded-md border border-gray-200 bg-gray-50/50 pl-7 pr-7 text-[11px] font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#E91E63] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="pt-0.5">
                <label className="block text-[9px] font-semibold uppercase tracking-wider text-gray-600 mb-0.5">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Card 1: Tenant */}
                  <div
                    onClick={() => setRole('TENANT')}
                    className={`relative cursor-pointer rounded-md border py-1 px-2 transition-all duration-200 ${role === 'TENANT'
                        ? 'border-[#E91E63] bg-rose-50/60 shadow-sm ring-1 ring-[#E91E63]/20'
                        : 'border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {role === 'TENANT' && (
                      <CheckCircle2 className="absolute top-1 right-1 h-3 w-3 text-[#E91E63]" />
                    )}
                    <div className="flex h-4 w-4 items-center justify-center rounded bg-rose-100 text-[#E91E63] mb-0.5">
                      <User className="h-2.5 w-2.5" />
                    </div>
                    <h4 className="text-[11px] font-bold text-[#1F2937]">Tenant</h4>
                    <p className="text-[8.5px] text-gray-500 leading-tight">
                      Find & rent properties
                    </p>
                  </div>

                  {/* Card 2: Landlord */}
                  <div
                    onClick={() => setRole('LANDLORD')}
                    className={`relative cursor-pointer rounded-md border py-1 px-2 transition-all duration-200 ${role === 'LANDLORD'
                        ? 'border-[#E91E63] bg-rose-50/60 shadow-sm ring-1 ring-[#E91E63]/20'
                        : 'border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {role === 'LANDLORD' && (
                      <CheckCircle2 className="absolute top-1 right-1 h-3 w-3 text-[#E91E63]" />
                    )}
                    <div className="flex h-4 w-4 items-center justify-center rounded bg-teal-100 text-[#0EA5A4] mb-0.5">
                      <Building2 className="h-2.5 w-2.5" />
                    </div>
                    <h4 className="text-[11px] font-bold text-[#1F2937]">Landlord</h4>
                    <p className="text-[8.5px] text-gray-500 leading-tight">
                      List & manage rentals
                    </p>
                  </div>
                </div>
              </div>

              {/* Create Account Primary Button */}
              <div className="pt-1">
                <PrimaryButton
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                  size="sm"
                  className="rounded-md font-semibold py-1 h-7 text-[11px]"
                >
                  Create Account
                </PrimaryButton>
              </div>
            </form>

            {/* Compact Divider */}
            <div className="relative my-1.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Google Login Component (100% Edge-to-Edge Full Width) */}
            <div className="w-full flex justify-center">
              <Suspense fallback={<div className="h-8 w-full animate-pulse rounded-full bg-gray-100" />}>
                <GoogleLoginButton />
              </Suspense>
            </div>

            {/* Footer Navigation Link */}
            <div className="mt-1.5 text-center text-[10px] text-gray-500">
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className="font-semibold text-[#E91E63] hover:text-[#D81B60] transition-colors">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
