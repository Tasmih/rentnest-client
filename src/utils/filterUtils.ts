import { PropertyFilterParams, PropertyType } from '@/types/property.types';
import { SearchBarValues } from '@/components/search/SearchBar';

/**
 * Converts frontend SearchBar form values (location, category, budget string)
 * into exact backend query parameters: area, propertyType, minRent, maxRent.
 */
export function parseSearchBarToQueryParams(values: SearchBarValues): Partial<PropertyFilterParams> {
  let minRent: number | undefined = undefined;
  let maxRent: number | undefined = undefined;

  if (values.budget) {
    if (values.budget.includes('-')) {
      const [minStr, maxStr] = values.budget.split('-');
      minRent = Number(minStr);
      maxRent = Number(maxStr);
    } else if (values.budget.endsWith('+')) {
      minRent = Number(values.budget.replace('+', ''));
      maxRent = undefined;
    }
  }

  return {
    area: values.location.trim() || undefined,
    propertyType: (values.category as PropertyType) || undefined,
    minRent,
    maxRent,
    page: 1,
  };
}
