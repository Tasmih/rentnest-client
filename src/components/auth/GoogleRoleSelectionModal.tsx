'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, CheckCircle2 } from 'lucide-react';
import { GoogleData } from '@/types/auth.types';
import { UserRole } from '@/types/user.types';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface GoogleRoleSelectionModalProps {
  isOpen: boolean;
  googleData: GoogleData;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoogleRoleSelectionModal({
  isOpen,
  googleData,
  onClose,
  onSuccess,
}: GoogleRoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('TENANT');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = await authService.completeGoogleSignup({
        name: googleData.name,
        email: googleData.email,
        googleId: googleData.googleId,
        avatarUrl: googleData.avatarUrl,
        role: selectedRole,
      });

      setAuth(data.user, data.token);
      showToast.success(`Welcome to RentNest as a ${selectedRole.toLowerCase()}!`);
      onClose();

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(ROUTES.DASHBOARD.ROOT);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete registration';
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-black/10"
        >
          {/* Header */}
          <div className="text-center">
            {googleData.avatarUrl && (
              <img
                src={googleData.avatarUrl}
                alt={googleData.name}
                className="mx-auto h-14 w-14 rounded-full border-2 border-rose-100 object-cover shadow-sm mb-3"
              />
            )}
            <h2 className="text-2xl font-bold tracking-tight text-[#1F2937]">
              How will you use RentNest?
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Welcome <span className="font-semibold text-gray-800">{googleData.name}</span>! Select your account type to complete registration.
            </p>
          </div>

          {/* Role Options */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Option 1: Tenant */}
            <div
              onClick={() => setSelectedRole('TENANT')}
              className={`relative cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
                selectedRole === 'TENANT'
                  ? 'border-[#E91E63] bg-rose-50/50 shadow-md ring-2 ring-[#E91E63]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              {selectedRole === 'TENANT' && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-[#E91E63]" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100/80 text-[#E91E63] mb-3">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Tenant</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Find and rent properties effortlessly.
              </p>
            </div>

            {/* Option 2: Landlord */}
            <div
              onClick={() => setSelectedRole('LANDLORD')}
              className={`relative cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
                selectedRole === 'LANDLORD'
                  ? 'border-[#E91E63] bg-rose-50/50 shadow-md ring-2 ring-[#E91E63]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              {selectedRole === 'LANDLORD' && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-[#E91E63]" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100/80 text-[#0EA5A4] mb-3">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Landlord</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                List properties and manage rentals.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <PrimaryButton
              onClick={handleSubmit}
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="rounded-xl"
            >
              Continue as {selectedRole === 'TENANT' ? 'Tenant' : 'Landlord'}
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
