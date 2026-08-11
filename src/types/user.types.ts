export type UserRole = 'TENANT' | 'LANDLORD' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
