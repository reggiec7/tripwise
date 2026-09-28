import { describe, it, expect } from 'vitest';
import { formatDay } from './format';

describe('formatDay', () => {
  it('should return "Unscheduled" for an empty key', () => {
    expect(formatDay('')).toBe('Unscheduled');
  });

  it('should return the original key for an invalid date string', () => {
    const invalidKey = 'invalid-date';
    expect(formatDay(invalidKey)).toBe(invalidKey);
  });

  it('should format a valid date key correctly', () => {
    const validKey = '2024-01-15';
    // Instead of hardcoding "Monday, January 15", construct the expected string
    // dynamically using the same options to avoid locale/timezone flakiness
    const expectedDate = new Date(`${validKey}T12:00:00`);
    const expectedString = expectedDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    expect(formatDay(validKey)).toBe(expectedString);
  });
});
