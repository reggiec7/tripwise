import type { Trip } from './types'
import { isValidTrip } from './validate'

const KEY = 'tripwise.trips.v1'

export const loadTrips = (): Trip[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidTrip)
    }
    return []
  } catch {
    return []
  }
}

export const saveTrips = (trips: Trip[]): void => {
  localStorage.setItem(KEY, JSON.stringify(trips))
}
