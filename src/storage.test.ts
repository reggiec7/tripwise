import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadTrips, saveTrips } from './storage'
import type { Trip } from './types'

describe('storage', () => {
  let store: Record<string, string> = {}

  const mockLocalStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', mockLocalStorage)
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  describe('loadTrips', () => {
    it('returns an empty array when localStorage has no data', () => {
      expect(loadTrips()).toEqual([])
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tripwise.trips.v1')
    })

    it('returns parsed trips when localStorage contains a valid JSON array', () => {
      const mockTrips: Trip[] = [
        { id: '1', destination: 'Paris', startDate: '2024-01-01', endDate: '2024-01-10', items: [] }
      ]
      store['tripwise.trips.v1'] = JSON.stringify(mockTrips)
      expect(loadTrips()).toEqual(mockTrips)
    })

    it('returns an empty array when localStorage contains valid JSON that is not an array', () => {
      store['tripwise.trips.v1'] = JSON.stringify({ notAnArray: true })
      expect(loadTrips()).toEqual([])
    })

    it('returns an empty array when localStorage contains invalid JSON that throws an error during JSON.parse', () => {
      store['tripwise.trips.v1'] = 'invalid json'
      expect(loadTrips()).toEqual([])
    })
  })

  describe('saveTrips', () => {
    it('serializes trips and calls localStorage.setItem correctly', () => {
      const mockTrips: Trip[] = [
        { id: '2', destination: 'London', startDate: '2024-02-01', endDate: '2024-02-10', items: [] }
      ]
      saveTrips(mockTrips)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tripwise.trips.v1', JSON.stringify(mockTrips))
      expect(store['tripwise.trips.v1']).toBe(JSON.stringify(mockTrips))
    })
  })
})
