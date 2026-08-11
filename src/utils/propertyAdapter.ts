import { Property } from '@/types/property.types';
import { DEFAULT_PROPERTY_IMAGE } from '@/constants/property.constants';

/**
 * Single Property Adapter Layer
 * Normalizes backend DTO from GET /api/properties & GET /api/properties/:id
 * into clean Property frontend model used across listing and details components.
 */
export function adaptProperty(raw: any): Property {
  const rentPrice = raw?.rent ?? raw?.price ?? 0;

  const validCover = typeof raw?.coverImage === 'string' && raw.coverImage.trim() !== '' ? raw.coverImage.trim() : null;
  const validFirstImage = Array.isArray(raw?.images) && raw.images.length > 0
    ? typeof raw.images[0] === 'string' ? raw.images[0] : raw.images[0]?.url
    : null;

  const coverImg = validCover || validFirstImage || DEFAULT_PROPERTY_IMAGE;

  const loc =
    raw?.area ||
    (typeof raw?.address === 'string' ? raw.address : raw?.address?.city) ||
    'Location Unavailable';

  const fullAddress = typeof raw?.address === 'string' ? raw.address : loc;
  const pType = raw?.propertyType || raw?.type || 'FLAT';

  // Construct amenities list from boolean feature flags & string arrays
  const amenitiesList: string[] = [];
  if (raw?.furnished) amenitiesList.push('Furnished');
  if (raw?.parking) amenitiesList.push('Parking Space');
  if (raw?.lift) amenitiesList.push('Elevator / Lift');
  if (raw?.bachelorAllowed) amenitiesList.push('Bachelor Allowed');
  if (raw?.familyAllowed) amenitiesList.push('Family Allowed');

  if (Array.isArray(raw?.amenities)) {
    raw.amenities.forEach((item: any) => {
      const name = typeof item === 'string' ? item : item?.name;
      if (name && !amenitiesList.includes(name)) {
        amenitiesList.push(name);
      }
    });
  }

  // Construct images list
  const imageList = Array.isArray(raw?.images) && raw.images.length > 0
    ? raw.images.map((img: any, idx: number) => ({
        id: img?.id || String(idx),
        url: typeof img === 'string' ? img : img?.url || coverImg,
        isPrimary: Boolean(img?.isPrimary || idx === 0),
      }))
    : [{ id: '1', url: coverImg, isPrimary: true }];

  return {
    id: raw?.id || String(Math.random()),
    title: raw?.title || 'Untitled Rental Property',
    description: raw?.description || 'No description provided for this property listing.',
    price: rentPrice,
    rent: rentPrice,
    serviceCharge: raw?.serviceCharge ?? 0,
    utilityCharge: raw?.utilityCharge ?? 0,
    location: loc,
    address: fullAddress,
    type: pType,
    propertyType: pType,
    image: coverImg,
    coverImage: coverImg,
    images: imageList,
    bedrooms: raw?.bedrooms ?? 0,
    bathrooms: raw?.bathrooms ?? 0,
    floor: raw?.floor,
    totalFloors: raw?.totalFloors,
    availableFrom: raw?.availableFrom,
    areaSquareFeet: raw?.areaSquareFeet ?? 1200,
    status: raw?.status || 'AVAILABLE',
    featured: Boolean(raw?.featured),
    rentalPeriod: raw?.rentalPeriod || 'month',
    furnished: Boolean(raw?.furnished),
    parking: Boolean(raw?.parking),
    lift: Boolean(raw?.lift),
    bachelorAllowed: Boolean(raw?.bachelorAllowed),
    familyAllowed: Boolean(raw?.familyAllowed),
    amenities: amenitiesList,
    category: raw?.category,
    landlord: raw?.landlord,
    createdAt: raw?.createdAt || new Date().toISOString(),
    updatedAt: raw?.updatedAt || new Date().toISOString(),
  };
}

export function adaptPropertyList(rawList: any[]): Property[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(adaptProperty);
}
