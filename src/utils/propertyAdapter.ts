import { Property } from '@/types/property.types';

const DEFAULT_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

/**
 * Single Property Adapter Layer
 * Converts backend DTO fields (rent, area, propertyType, coverImage, bedrooms, bathrooms)
 * to clean frontend Property model (price, location, type, image, bedrooms, bathrooms).
 */
export function adaptProperty(raw: any): Property {
  const rentPrice = raw?.rent ?? raw?.price ?? 0;
  const coverImg =
    raw?.coverImage ||
    (Array.isArray(raw?.images) && raw.images.length > 0
      ? typeof raw.images[0] === 'string'
        ? raw.images[0]
        : raw.images[0]?.url
      : DEFAULT_PROPERTY_IMAGE);

  const loc =
    raw?.area ||
    (typeof raw?.address === 'string' ? raw.address : raw?.address?.city) ||
    'Location Unavailable';

  const pType = raw?.propertyType || raw?.type || 'FLAT';

  return {
    id: raw?.id || String(Math.random()),
    title: raw?.title || 'Untitled Property',
    price: rentPrice,
    rent: rentPrice,
    location: loc,
    address: typeof raw?.address === 'string' ? raw.address : loc,
    type: pType,
    propertyType: pType,
    image: coverImg,
    coverImage: coverImg,
    bedrooms: raw?.bedrooms ?? 0,
    bathrooms: raw?.bathrooms ?? 0,
    areaSquareFeet: raw?.areaSquareFeet ?? 1200,
    status: raw?.status || 'AVAILABLE',
    featured: Boolean(raw?.featured),
    rentalPeriod: raw?.rentalPeriod || 'month',
    createdAt: raw?.createdAt || new Date().toISOString(),
  };
}

export function adaptPropertyList(rawList: any[]): Property[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(adaptProperty);
}
