export type ItemKind = 'flight' | 'hotel' | 'activity'

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

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
