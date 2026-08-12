'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user.types';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  unauthorizedRedirectUrl?: string;
  loginRedirectUrl?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  unauthorizedRedirectUrl = ROUTES.HOME,
  loginRedirectUrl = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, hasHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${loginRedirectUrl}?returnUrl=${returnUrl}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
      router.replace(unauthorizedRedirectUrl);
    }
  }, [hasHydrated, isAuthenticated, allowedRoles, hasRole, router, pathname, loginRedirectUrl, unauthorizedRedirectUrl]);

  // Show loading spinner while Zustand persist is rehydrating from localStorage
  if (!hasHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-xs text-gray-400 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}

export function TenantGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['TENANT']}>{children}</ProtectedRoute>;
}

export function LandlordGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['LANDLORD']}>{children}</ProtectedRoute>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['ADMIN']}>{children}</ProtectedRoute>;
}

