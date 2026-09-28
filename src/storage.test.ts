import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveTrips, loadTrips } from './storage'
import type { Trip } from './types'

describe('storage', () => {
  describe('saveTrips', () => {
    let setItemSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
      setItemSpy = vi.fn()
      vi.stubGlobal('localStorage', {
        setItem: setItemSpy,
        getItem: vi.fn(),
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should save trips to localStorage as a JSON string', () => {
      const trips: Trip[] = [
        {
          id: '1',
          destination: 'Paris',
          startDate: '2025-05-01',
          endDate: '2025-05-10',
        }
      ]

      saveTrips(trips)

      expect(setItemSpy).toHaveBeenCalledWith(
        'tripwise.trips.v1',
        JSON.stringify(trips)
      )
    })

    it('should handle saving an empty array of trips', () => {
      saveTrips([])

      expect(setItemSpy).toHaveBeenCalledWith(
        'tripwise.trips.v1',
        '[]'
      )
    })
  })

  describe('loadTrips', () => {
    let getItemSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
      getItemSpy = vi.fn()
      vi.stubGlobal('localStorage', {
        setItem: vi.fn(),
        getItem: getItemSpy,
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should load trips from localStorage and parse the JSON', () => {
      const trips: Trip[] = [
        {
          id: '1',
          destination: 'Paris',
          startDate: '2025-05-01',
          endDate: '2025-05-10',
        }
      ]
      getItemSpy.mockReturnValue(JSON.stringify(trips))

      const loadedTrips = loadTrips()

      expect(getItemSpy).toHaveBeenCalledWith('tripwise.trips.v1')
      expect(loadedTrips).toEqual(trips)
    })

    it('should return an empty array if localStorage is empty', () => {
      getItemSpy.mockReturnValue(null)

      const loadedTrips = loadTrips()

      expect(loadedTrips).toEqual([])
    })

    it('should return an empty array if localStorage contains invalid JSON', () => {
      getItemSpy.mockReturnValue('invalid-json')

      const loadedTrips = loadTrips()

      expect(loadedTrips).toEqual([])
    })

    it('should return an empty array if localStorage contains a non-array JSON', () => {
      getItemSpy.mockReturnValue(JSON.stringify({ notAnArray: true }))

      const loadedTrips = loadTrips()

      expect(loadedTrips).toEqual([])
    })
  })
})
