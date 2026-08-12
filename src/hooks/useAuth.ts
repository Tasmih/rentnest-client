import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/user.types';

export function useAuth() {
  const { user, token, isAuthenticated, _hasHydrated, setAuth, logout, setUser } = useAuthStore();

  const hasRole = (allowedRoles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return rolesArray.includes(user.role);
  };

  const isTenant = user?.role === 'TENANT';
  const isLandlord = user?.role === 'LANDLORD';
  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    token,
    isAuthenticated,
    hasHydrated: _hasHydrated,
    role: user?.role,
    isTenant,
    isLandlord,
    isAdmin,
    hasRole,
    setAuth,
    logout,
    setUser,
  };
}

