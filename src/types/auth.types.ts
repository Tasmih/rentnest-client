import { User, UserRole } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export type RegisterResponseData = User;
