import { describe, it, expect } from 'vitest'
import { formatDateTime } from '../format'

describe('formatDateTime', () => {
  it('returns "No date" for empty values', () => {
    expect(formatDateTime('')).toBe('No date')
  })

  it('returns the original value if the date is invalid', () => {
    expect(formatDateTime('invalid-date-string')).toBe('invalid-date-string')
    expect(formatDateTime('not a date')).toBe('not a date')
  })

  it('formats dates with time correctly', () => {
    const dateStr = '2023-10-27T10:30:00'
    const result = formatDateTime(dateStr)
    const expected = new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

    expect(result).toBe(expected)
  })

  it('formats dates without time correctly', () => {
    const dateStr = '2023-10-27'
    const result = formatDateTime(dateStr)
    const expected = new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    expect(result).toBe(expected)
  })
})
