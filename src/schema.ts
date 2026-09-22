import { z } from 'zod'
import type { Trip, TripItem } from './types'

const fallbackString = z.string().catch('')
const fallbackNumber = z.number().catch(0)

export const baseItemSchema = z.object({
  id: z.string().catch(() => crypto.randomUUID()),
  title: fallbackString,
  start: fallbackString,
  end: fallbackString,
  confirmation: fallbackString,
  cost: fallbackNumber,
  notes: fallbackString,
  status: z.enum(['confirmed', 'pending', 'cancelled']).catch('confirmed'),
})

export const flightSchema = baseItemSchema.extend({
  kind: z.literal('flight'),
  airline: fallbackString,
  flightNumber: fallbackString,
  from: fallbackString,
  to: fallbackString,
  seat: fallbackString,
})

export const hotelSchema = baseItemSchema.extend({
  kind: z.literal('hotel'),
  address: fallbackString,
  roomType: fallbackString,
})

export const activitySchema = baseItemSchema.extend({
  kind: z.literal('activity'),
  location: fallbackString,
  category: fallbackString,
})

export const tripItemSchema = z.discriminatedUnion('kind', [
  flightSchema,
  hotelSchema,
  activitySchema,
])

export const tripSchema = z.object({
  id: z.string().catch(() => crypto.randomUUID()),
  name: fallbackString,
  destination: fallbackString,
  start: fallbackString,
  end: fallbackString,
  travelers: fallbackString,
  budget: fallbackNumber,
  items: z.array(z.any()).transform((items) => {
    return items
      .map(item => tripItemSchema.safeParse(item))
      .filter((res) => res.success)
      .map((res) => res.data as TripItem)
  }).catch([]),
})

export const tripsSchema = z.array(z.any()).transform((trips) => {
  return trips
    .map(trip => tripSchema.safeParse(trip))
    .filter((res) => res.success)
    .map((res) => res.data as Trip)
}).catch([])
