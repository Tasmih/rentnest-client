/**
 * Formats a numeric value into currency format (USD)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats square footage with commas
 */
export const formatArea = (sqft: number): string => {
  return new Intl.NumberFormat('en-US').format(sqft);
};
