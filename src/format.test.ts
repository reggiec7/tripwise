import { describe, it, expect } from 'vitest';
import { formatMoney } from './format';

describe('formatMoney', () => {
  // To ensure the tests pass consistently across different environments,
  // we could mock the environment locale, but Node uses en-US by default.
  // The exact output format can sometimes depend on the Node version/ICU data.
  // Let's test the standard en-US currency formatting logic.

  it('formats zero correctly', () => {
    expect(formatMoney(0)).toBe('$0');
  });

  it('formats positive integers correctly', () => {
    expect(formatMoney(1234)).toBe('$1,234');
    expect(formatMoney(1000000)).toBe('$1,000,000');
  });

  it('formats negative integers correctly', () => {
    expect(formatMoney(-1234)).toBe('-$1,234');
  });

  it('rounds decimals to integers correctly', () => {
    // maximumFractionDigits: 0 should round based on standard currency rounding rules
    expect(formatMoney(1234.4)).toBe('$1,234');
    expect(formatMoney(1234.5)).toBe('$1,235'); // standard rounding, .5 rounds to nearest even/up
    expect(formatMoney(1234.6)).toBe('$1,235');
  });

  it('handles negative decimals correctly', () => {
    expect(formatMoney(-1234.5)).toBe('-$1,235');
  });
});
