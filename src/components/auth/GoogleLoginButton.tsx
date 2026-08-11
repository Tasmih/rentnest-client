'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';
import { GoogleData } from '@/types/auth.types';
import { GoogleRoleSelectionModal } from './GoogleRoleSelectionModal';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [googleData, setGoogleData] = useState<GoogleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showToast.error('Google login failed: Credential token not received');
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.googleLogin(credentialResponse.credential);

      // CASE 1: New Google user -> Open role selection modal
      if (data.requiresRoleSelection && data.googleData) {
        setGoogleData(data.googleData);
        setIsModalOpen(true);
        return;
      }

      // CASE 2: Existing Google user -> Direct login
      if (data.user && data.token) {
        setAuth(data.user, data.token);
        showToast.success('Google login successful!');

        if (onSuccess) {
          onSuccess();
        } else {
          const returnUrl = searchParams.get('returnUrl');
          router.push(returnUrl ? decodeURIComponent(returnUrl) : ROUTES.DASHBOARD.ROOT);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
      showToast.error(errorMessage);
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    showToast.error('Google login failed or popup closed');
  };

  return (
    <>
      <div className="w-full flex items-center justify-center min-h-[40px] [&>div]:w-full [&_iframe]:!w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 py-2 w-full bg-gray-50 rounded-lg border border-gray-200">
            <svg className="h-4 w-4 animate-spin text-[#E91E63]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Authenticating with Google...</span>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="rectangular"
            theme="outline"
            size="large"
            text="continue_with"
            logo_alignment="left"
            width="100%"
          />
        )}
      </div>

      {/* Role selection modal for new Google users */}
      {googleData && (
        <GoogleRoleSelectionModal
          isOpen={isModalOpen}
          googleData={googleData}
          onClose={() => setIsModalOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
