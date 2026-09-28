import { describe, it, expect } from 'vitest';
import { formatMoney } from './format';

describe('formatMoney', () => {
  it('formats positive integers correctly', () => {
    const value = 1000;
    const expected = value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    expect(formatMoney(value)).toBe(expected);
  });

  it('formats zero correctly', () => {
    const value = 0;
    const expected = value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    expect(formatMoney(value)).toBe(expected);
  });

  it('formats negative numbers correctly', () => {
    const value = -50;
    const expected = value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    expect(formatMoney(value)).toBe(expected);
  });

  it('rounds down decimals correctly', () => {
    const value = 1234.4;
    const expected = value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    expect(formatMoney(value)).toBe(expected);
  });

  it('rounds up decimals correctly', () => {
    const value = 1234.6;
    const expected = value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    expect(formatMoney(value)).toBe(expected);
  });
});
