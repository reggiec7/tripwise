import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tripStatus } from '../format'

describe('tripStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Set system time to a local date string (not UTC) to avoid timezone offset issues
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns upcoming for trips starting in the future', () => {
    expect(tripStatus('2024-01-20', '2024-01-25')).toBe('upcoming')
  })

  it('returns past for trips ending in the past', () => {
    expect(tripStatus('2024-01-01', '2024-01-10')).toBe('past')
  })

  it('returns active for trips currently happening (start in past, end in future)', () => {
    expect(tripStatus('2024-01-10', '2024-01-20')).toBe('active')
  })

  it('returns active for one-day trips happening today', () => {
    expect(tripStatus('2024-01-15', '2024-01-15')).toBe('active')
  })

  it('returns active for trips ending today', () => {
    expect(tripStatus('2024-01-10', '2024-01-15')).toBe('active')
  })

  it('returns active for trips starting today', () => {
    expect(tripStatus('2024-01-15', '2024-01-20')).toBe('active')
  })

  it('returns active as a fallback for invalid dates', () => {
    expect(tripStatus('', '')).toBe('active')
    expect(tripStatus('invalid', 'invalid')).toBe('active')
  })
})
