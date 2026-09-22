import { z } from 'zod'

export type ItemKind = 'flight' | 'hotel' | 'activity'

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

const bookingStatusSchema = z.enum(['confirmed', 'pending', 'cancelled'])

const baseItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.string(),
  end: z.string(),
  confirmation: z.string(),
  cost: z.number(),
  notes: z.string(),
  status: bookingStatusSchema,
})

const flightSchema = baseItemSchema.extend({
  kind: z.literal('flight'),
  airline: z.string(),
  flightNumber: z.string(),
  from: z.string(),
  to: z.string(),
  seat: z.string(),
})

const hotelSchema = baseItemSchema.extend({
  kind: z.literal('hotel'),
  address: z.string(),
  roomType: z.string(),
})

const activitySchema = baseItemSchema.extend({
  kind: z.literal('activity'),
  location: z.string(),
  category: z.string(),
})

const tripItemSchema = z.discriminatedUnion('kind', [flightSchema, hotelSchema, activitySchema])

export const tripSchema = z.object({
  id: z.string(),
  name: z.string(),
  destination: z.string(),
  start: z.string(),
  end: z.string(),
  travelers: z.string(),
  budget: z.number(),
  items: z.array(tripItemSchema),
})

export const tripsSchema = z.array(tripSchema)

interface BaseItem {
  id: string
  kind: ItemKind
  title: string
  start: string
  end: string
  confirmation: string
  cost: number
  notes: string
  status: BookingStatus
}

export interface Flight extends BaseItem {
  kind: 'flight'
  airline: string
  flightNumber: string
  from: string
  to: string
  seat: string
}

export interface Hotel extends BaseItem {
  kind: 'hotel'
  address: string
  roomType: string
}

export interface Activity extends BaseItem {
  kind: 'activity'
  location: string
  category: string
}

export type TripItem = Flight | Hotel | Activity

export interface Trip {
  id: string
  name: string
  destination: string
  start: string
  end: string
  travelers: string
  budget: number
  items: TripItem[]
}

export const emptyItem = (kind: ItemKind): TripItem => {
  const base = {
    id: crypto.randomUUID(),
    title: '',
    start: '',
    end: '',
    confirmation: '',
    cost: 0,
    notes: '',
    status: 'confirmed' as BookingStatus,
  }
  if (kind === 'flight') {
    return { ...base, kind, airline: '', flightNumber: '', from: '', to: '', seat: '' }
  }
  if (kind === 'hotel') {
    return { ...base, kind, address: '', roomType: '' }
  }
  return { ...base, kind, location: '', category: '' }
}

export const emptyTrip = (): Trip => ({
  id: crypto.randomUUID(),
  name: '',
  destination: '',
  start: '',
  end: '',
  travelers: '',
  budget: 0,
  items: [],
})
