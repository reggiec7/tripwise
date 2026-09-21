import type { Trip, TripItem } from './types'

export const isValidTripItem = (item: unknown): item is TripItem => {
  if (!item || typeof item !== 'object') return false

  const record = item as Record<string, unknown>

  if (
    typeof record.id !== 'string' ||
    typeof record.title !== 'string' ||
    typeof record.start !== 'string' ||
    typeof record.end !== 'string' ||
    typeof record.confirmation !== 'string' ||
    typeof record.cost !== 'number' ||
    typeof record.notes !== 'string' ||
    !['confirmed', 'pending', 'cancelled'].includes(record.status as string)
  ) {
    return false
  }

  if (record.kind === 'flight') {
    return (
      typeof record.airline === 'string' &&
      typeof record.flightNumber === 'string' &&
      typeof record.from === 'string' &&
      typeof record.to === 'string' &&
      typeof record.seat === 'string'
    )
  } else if (record.kind === 'hotel') {
    return (
      typeof record.address === 'string' &&
      typeof record.roomType === 'string'
    )
  } else if (record.kind === 'activity') {
    return (
      typeof record.location === 'string' &&
      typeof record.category === 'string'
    )
  }
  return false
}

export const isValidTrip = (data: unknown): data is Trip => {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  if (
    typeof record.id !== 'string' ||
    typeof record.name !== 'string' ||
    typeof record.destination !== 'string' ||
    typeof record.start !== 'string' ||
    typeof record.end !== 'string' ||
    typeof record.travelers !== 'string' ||
    typeof record.budget !== 'number' ||
    !Array.isArray(record.items)
  ) {
    return false
  }

  return record.items.every(isValidTripItem)
}
