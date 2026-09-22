import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { daysUntil } from '../format';

describe('daysUntil', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set system time to an arbitrary date for consistent testing
    // Note: Use a timezone-agnostic approach or local midnight
    vi.setSystemTime(new Date('2023-10-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for empty string', () => {
    expect(daysUntil('')).toBeNull();
  });

  it('returns null for invalid date string', () => {
    expect(daysUntil('not-a-date')).toBeNull();
  });

  it('returns 0 for the same day', () => {
    // Current day based on system time (2023-10-15 in local timezone, but depends on environment)
    // To be perfectly safe across timezones, let's just get today from fake timers
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(daysUntil(todayStr)).toBe(0);
  });

  it('returns a positive number for future dates', () => {
    const today = new Date();
    // Set to 5 days in the future
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5);
    const futureStr = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`;
    expect(daysUntil(futureStr)).toBe(5);
  });

  it('returns a negative number for past dates', () => {
    const today = new Date();
    // Set to 3 days in the past
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 3);
    const pastStr = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDate.getDate()).padStart(2, '0')}`;
    expect(daysUntil(pastStr)).toBe(-3);
  });

  it('handles leap years correctly', () => {
    // Set system time to Feb 28, 2024 (a leap year)
    vi.setSystemTime(new Date('2024-02-28T12:00:00.000Z'));
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // We mock today, so we should test 2 days ahead, which crosses leap day
    // Wait, Feb 28 + 2 days = Mar 1 in leap year
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 2);
    const futureStr = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`;

    expect(daysUntil(futureStr)).toBe(2);
  });
});
