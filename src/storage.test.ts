import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadTrips, saveTrips } from './storage'
import type { Trip } from './types'

const KEY = 'tripwise.trips.v1'

describe('storage', () => {
  let getItemMock: ReturnType<typeof vi.fn>
  let setItemMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    getItemMock = vi.fn()
    setItemMock = vi.fn()
    vi.stubGlobal('localStorage', {
      getItem: getItemMock,
      setItem: setItemMock
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('loadTrips', () => {
    it('returns an empty array if localStorage has no item', () => {
      getItemMock.mockReturnValue(null)
      expect(loadTrips()).toEqual([])
      expect(getItemMock).toHaveBeenCalledWith(KEY)
    })

    it('returns an empty array if localStorage contains invalid JSON', () => {
      getItemMock.mockReturnValue('invalid-json')
      expect(loadTrips()).toEqual([])
      expect(getItemMock).toHaveBeenCalledWith(KEY)
    })

    it('returns an empty array if localStorage contains non-array valid JSON', () => {
      getItemMock.mockReturnValue('{"some":"object"}')
      expect(loadTrips()).toEqual([])
      expect(getItemMock).toHaveBeenCalledWith(KEY)
    })

    it('returns an empty array if localStorage.getItem throws an exception', () => {
      getItemMock.mockImplementation(() => {
        throw new Error('localStorage is not available')
      })
      expect(loadTrips()).toEqual([])
      expect(getItemMock).toHaveBeenCalledWith(KEY)
    })

    it('returns the parsed array if localStorage contains a valid JSON array', () => {
      const trips: Trip[] = [
        { id: '1', destination: 'Paris', startDate: '2024-05-01', endDate: '2024-05-10', status: 'upcoming', budget: 1000 }
      ]
      getItemMock.mockReturnValue(JSON.stringify(trips))
      expect(loadTrips()).toEqual(trips)
      expect(getItemMock).toHaveBeenCalledWith(KEY)
    })
  })

  describe('saveTrips', () => {
    it('calls localStorage.setItem with the correct key and serialized array', () => {
      const trips: Trip[] = [
        { id: '1', destination: 'Paris', startDate: '2024-05-01', endDate: '2024-05-10', status: 'upcoming', budget: 1000 }
      ]
      saveTrips(trips)
      expect(setItemMock).toHaveBeenCalledWith(KEY, JSON.stringify(trips))
    })
  })
})
