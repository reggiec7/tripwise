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

export const isValidTripItem = (item: any): item is TripItem => {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.id !== 'string') return false;
  if (typeof item.title !== 'string') return false;
  if (typeof item.start !== 'string') return false;
  if (typeof item.end !== 'string') return false;
  if (typeof item.confirmation !== 'string') return false;
  if (typeof item.cost !== 'number') return false;
  if (typeof item.notes !== 'string') return false;
  if (!['confirmed', 'pending', 'cancelled'].includes(item.status)) return false;

  if (item.kind === 'flight') {
    return (
      typeof item.airline === 'string' &&
      typeof item.flightNumber === 'string' &&
      typeof item.from === 'string' &&
      typeof item.to === 'string' &&
      typeof item.seat === 'string'
    );
  }

  if (item.kind === 'hotel') {
    return typeof item.address === 'string' && typeof item.roomType === 'string';
  }

  if (item.kind === 'activity') {
    return typeof item.location === 'string' && typeof item.category === 'string';
  }

  return false;
};

export const isValidTrip = (trip: any): trip is Trip => {
  if (!trip || typeof trip !== 'object') return false;
  if (typeof trip.id !== 'string') return false;
  if (typeof trip.name !== 'string') return false;
  if (typeof trip.destination !== 'string') return false;
  if (typeof trip.start !== 'string') return false;
  if (typeof trip.end !== 'string') return false;
  if (typeof trip.travelers !== 'string') return false;
  if (typeof trip.budget !== 'number') return false;
  if (!Array.isArray(trip.items)) return false;

  return trip.items.every(isValidTripItem);
};
