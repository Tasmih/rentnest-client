export const APP_CONFIG = {
  NAME: 'RentNest',
  DESCRIPTION: 'Find your dream rental home with RentNest.',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  AUTH_TOKEN_KEY: 'rentnest_auth_token',
  PAGINATION_LIMIT: 12,
} as const;
