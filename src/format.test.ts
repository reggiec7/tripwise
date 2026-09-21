import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tripStatus } from './format'

describe('tripStatus', () => {
  beforeEach(() => {
    // Set a fixed system time so tests are deterministic
    vi.useFakeTimers()
    // Oct 1, 2023 12:00:00 local time
    vi.setSystemTime(new Date(2023, 9, 1, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "upcoming" when start date is in the future', () => {
    expect(tripStatus('2023-10-05', '2023-10-10')).toBe('upcoming')
  })

  it('returns "past" when end date is in the past', () => {
    expect(tripStatus('2023-09-20', '2023-09-25')).toBe('past')
  })

  it('returns "active" when the current date is between start and end dates', () => {
    expect(tripStatus('2023-09-20', '2023-10-10')).toBe('active')
  })

  it('returns "active" when the trip starts today', () => {
    expect(tripStatus('2023-10-01', '2023-10-10')).toBe('active')
  })

  it('returns "active" when the trip ends today', () => {
    expect(tripStatus('2023-09-20', '2023-10-01')).toBe('active')
  })

  it('returns "active" when both start and end dates are invalid or empty', () => {
    expect(tripStatus('', '')).toBe('active')
    expect(tripStatus('invalid-date', 'invalid-date')).toBe('active')
  })
})
