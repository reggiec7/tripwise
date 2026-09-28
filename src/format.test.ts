import { describe, it, expect } from 'vitest'
import { formatDateTime } from './format'

describe('formatDateTime', () => {
  it('returns "No date" for empty string', () => {
    expect(formatDateTime('')).toBe('No date')
  })

  it('returns the input string for invalid dates', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date')
  })

  it('formats valid date string without time', () => {
    const input = '2023-10-15'
    const date = new Date(input)
    const expected = date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    expect(formatDateTime(input)).toBe(expected)
  })

  it('formats valid date string with time', () => {
    const input = '2023-10-15T14:30:00'
    const date = new Date(input)
    const expected = date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    expect(formatDateTime(input)).toBe(expected)
  })
})
