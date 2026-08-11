'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/components/ui/toastConfig';
import { ROUTES } from '@/constants/routes';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showToast.error('Google login failed: Credential not received');
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.googleLogin(credentialResponse.credential);

      // Store token, user profile, and isAuthenticated in Zustand store
      setAuth(data.user, data.token);
      showToast.success('Google login successful!');

      if (onSuccess) {
        onSuccess();
      } else {
        const returnUrl = searchParams.get('returnUrl');
        router.push(returnUrl ? decodeURIComponent(returnUrl) : ROUTES.DASHBOARD.ROOT);
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
    <div className="flex flex-col items-center justify-center w-full">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 py-2">
          <svg className="h-5 w-5 animate-spin text-[#0F172A]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Authenticating with Google...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          shape="circle"
          theme="outline"
          size="large"
          text="continue_with"
          width="100%"
        />
      )}
    </div>
  );
}
