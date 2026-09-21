import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadTrips, saveTrips } from './storage'
import type { Trip } from './types'

const KEY = 'tripwise.trips.v1'

describe('storage.ts', () => {
  let store: Record<string, string> = {}

  beforeEach(() => {
    store = {}

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString()
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      })
    }

    vi.stubGlobal('localStorage', localStorageMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('loadTrips', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(loadTrips()).toEqual([])
      expect(localStorage.getItem).toHaveBeenCalledWith(KEY)
    })

    it('returns empty array when localStorage data is invalid JSON', () => {
      store[KEY] = '{invalid json'
      expect(loadTrips()).toEqual([])
    })

    it('returns empty array when valid JSON is not an array', () => {
      store[KEY] = JSON.stringify({ notAnArray: true })
      expect(loadTrips()).toEqual([])
    })

    it('returns parsed trips when localStorage contains valid array', () => {
      const mockTrips: Trip[] = [
        {
          id: '1',
          name: 'Test Trip',
          destination: 'Test City',
          start: '2024-01-01',
          end: '2024-01-05',
          travelers: 'Alice',
          budget: 1000,
          items: []
        }
      ]
      store[KEY] = JSON.stringify(mockTrips)

      const loaded = loadTrips()
      expect(loaded).toEqual(mockTrips)
      expect(Array.isArray(loaded)).toBe(true)
      expect(loaded.length).toBe(1)
    })
  })

  describe('saveTrips', () => {
    it('serializes array and saves to localStorage', () => {
      const mockTrips: Trip[] = [
        {
          id: '2',
          name: 'Another Trip',
          destination: 'Another City',
          start: '2024-02-01',
          end: '2024-02-05',
          travelers: 'Bob',
          budget: 2000,
          items: []
        }
      ]

      saveTrips(mockTrips)

      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(mockTrips))
      expect(store[KEY]).toBe(JSON.stringify(mockTrips))
    })

    it('can save an empty array', () => {
      saveTrips([])
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, '[]')
      expect(store[KEY]).toBe('[]')
    })
  })
})
