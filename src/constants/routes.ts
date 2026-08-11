export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: {
    ROOT: '/dashboard',
    SAVED: '/dashboard/saved',
    MY_PROPERTIES: '/dashboard/my-properties',
    ADD_PROPERTY: '/dashboard/add-property',
    SETTINGS: '/dashboard/settings',
  },
} as const;
