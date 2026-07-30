import { describe, expect, it } from 'vitest';
import { formatCurrency } from '@/utils/format';
import { formatCategoryLabel } from '@/constants/vehicles';

describe('formatCurrency', () => {
  it('should format USD without cents', () => {
    expect(formatCurrency(25000)).toBe('$25,000');
  });
});

describe('formatCategoryLabel', () => {
  it('should capitalize the first letter', () => {
    expect(formatCategoryLabel('sedan')).toBe('Sedan');
  });
});
