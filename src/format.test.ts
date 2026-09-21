import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatMoney,
  formatDateTime,
  dayKey,
  formatDay,
  daysUntil,
  tripStatus,
} from './format'

describe('formatMoney', () => {
  it('formats positive numbers as USD currency', () => {
    expect(formatMoney(100)).toBe('$100')
    expect(formatMoney(1234.56)).toBe('$1,235') // max fraction digits is 0, so it rounds up
  })

  it('formats zero correctly', () => {
    expect(formatMoney(0)).toBe('$0')
  })

  it('formats negative numbers correctly', () => {
    expect(formatMoney(-50)).toBe('-$50')
  })
})

describe('formatDateTime', () => {
  it('returns "No date" for empty value', () => {
    expect(formatDateTime('')).toBe('No date')
  })

  it('returns original value for invalid date', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date')
  })

  it('formats date without time', () => {
    // Expected output format: 'short month numeric day, numeric year'
    // '2023-10-15' might be parsed as UTC and could shift depending on timezone if we are not careful,
    // but the implementation uses local time: new Date(value).toLocaleString()
    // By providing standard strings, let's check basic formatting.
    // To avoid timezone flakiness with "2023-10-15", we can use a date like "2023/10/15" which
    // parses in local time.
    const dateStr = new Date('2023/10/15').toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    expect(formatDateTime('2023/10/15')).toBe(dateStr)
  })

  it('formats date with time if "T" is present', () => {
    const value = '2023-10-15T14:30:00'
    const dateStr = new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
    expect(formatDateTime(value)).toBe(dateStr)
  })
})

describe('dayKey', () => {
  it('returns empty string for empty input', () => {
    expect(dayKey('')).toBe('')
  })

  it('slices first 10 characters for valid input', () => {
    expect(dayKey('2023-10-15T14:30:00')).toBe('2023-10-15')
  })

  it('handles strings shorter than 10 characters', () => {
    expect(dayKey('2023')).toBe('2023')
  })
})

describe('formatDay', () => {
  it('returns "Unscheduled" for empty key', () => {
    expect(formatDay('')).toBe('Unscheduled')
  })

  it('returns original key for invalid date', () => {
    expect(formatDay('not-a-date')).toBe('not-a-date')
  })

  it('formats valid date key correctly', () => {
    // Expected output format: 'weekday, month day'
    const key = '2023-10-15'
    const dateStr = new Date(`${key}T12:00:00`).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    expect(formatDay(key)).toBe(dateStr)
  })
})

describe('Time dependent functions', () => {
  beforeEach(() => {
    // Mock the current date to October 15, 2023, 12:00 PM local time
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-10-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('daysUntil', () => {
    it('returns null for empty value', () => {
      expect(daysUntil('')).toBeNull()
    })

    it('returns null for invalid date', () => {
      expect(daysUntil('not-a-date')).toBeNull()
    })

    it('returns correct days for future date', () => {
      // Current date is 2023-10-15.
      // 2023-10-20 should be 5 days away.
      expect(daysUntil('2023-10-20')).toBe(5)
    })

    it('returns correct days for past date', () => {
      // 2023-10-10 should be -5 days away.
      expect(daysUntil('2023-10-10')).toBe(-5)
    })

    it('returns 0 for today', () => {
      expect(daysUntil('2023-10-15')).toBe(0)
    })
  })

  describe('tripStatus', () => {
    it('returns "upcoming" if start is in the future', () => {
      expect(tripStatus('2023-10-20', '2023-10-25')).toBe('upcoming')
    })

    it('returns "past" if end is in the past', () => {
      expect(tripStatus('2023-10-01', '2023-10-10')).toBe('past')
    })

    it('returns "active" if start is today or past, and end is future or today', () => {
      expect(tripStatus('2023-10-10', '2023-10-20')).toBe('active') // Started 5 days ago, ends in 5 days
      expect(tripStatus('2023-10-15', '2023-10-20')).toBe('active') // Starts today, ends in 5 days
      expect(tripStatus('2023-10-10', '2023-10-15')).toBe('active') // Started 5 days ago, ends today
      expect(tripStatus('2023-10-15', '2023-10-15')).toBe('active') // Starts and ends today
    })
  })
})
