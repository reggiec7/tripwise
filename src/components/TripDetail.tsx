import { useMemo, useState } from 'react'
import type { ItemKind, Trip, TripItem } from '../types'
import { calculateSpent, dayKey, daysUntil, formatDay, formatMoney } from '../format'
import { ItemForm } from './ItemForm'
import { TripItemCard } from './TripItemCard'
import { Plane, Hotel, Ticket, ArrowLeft, Plus } from 'lucide-react'

interface Props {
  trip: Trip
  onBack: () => void
  onChange: (trip: Trip) => void
}

const icons = { flight: <Plane size={20} />, hotel: <Hotel size={20} />, activity: <Ticket size={20} /> }
const kinds: ItemKind[] = ['flight', 'hotel', 'activity']
const plural: Record<ItemKind, string> = {
  flight: 'flights',
  hotel: 'hotels',
  activity: 'activities',
}

export const TripDetail = ({ trip, onBack, onChange }: Props) => {
  const [adding, setAdding] = useState<ItemKind | null>(null)
  const [editing, setEditing] = useState<TripItem | null>(null)
  const [filter, setFilter] = useState<ItemKind | 'all'>('all')

  const visible = useMemo(
    () =>
      trip.items
        .filter((item) => filter === 'all' || item.kind === filter)
        .slice()
        .sort((a, b) => a.start.localeCompare(b.start)),
    [trip.items, filter],
  )

  const days = useMemo(() => {
    const groups = new Map<string, TripItem[]>()
    for (const item of visible) {
      const key = dayKey(item.start)
      groups.set(key, [...(groups.get(key) ?? []), item])
    }
    return [...groups.entries()]
  }, [visible])

  const spent = calculateSpent(trip.items)
  const pending = trip.items.filter((item) => item.status === 'pending').length
  const countdown = daysUntil(trip.start)

  const upsert = (item: TripItem) => {
    const exists = trip.items.some((existing) => existing.id === item.id)
    onChange({
      ...trip,
      items: exists
        ? trip.items.map((existing) => (existing.id === item.id ? item : existing))
        : [...trip.items, item],
    })
    setAdding(null)
    setEditing(null)
  }

  const remove = (id: string) =>
    onChange({ ...trip, items: trip.items.filter((item) => item.id !== id) })

  return (
    <section>
      <button
        className="flex items-center gap-1.5 bg-slate-900 border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border hover:border-slate-500 transition-colors mb-4"
        onClick={onBack}
      >
        <ArrowLeft size={16} /> All trips
      </button>
      <header className="flex justify-between items-start gap-4 flex-wrap my-4 mb-6">
        <div>
          <h1 className="text-[1.9rem] m-0 font-bold">{trip.name}</h1>
          <p className="text-slate-400 text-sm m-0 mt-1">
            {trip.destination} · {trip.start} → {trip.end}
            {trip.travelers ? ` · ${trip.travelers}` : ''}
          </p>
        </div>
        {countdown !== null && countdown > 0 && (
          <div className="flex flex-col items-center bg-slate-900 border border-sky-400 rounded-xl px-4 py-2">
            <strong className="text-[1.75rem] leading-tight text-sky-400">{countdown}</strong>
            <span className="text-[0.75rem] text-slate-400 uppercase tracking-wide">days to go</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-slate-400 text-sm">Booked</span>
          <strong className="text-[1.4rem] leading-tight">{formatMoney(spent)}</strong>
          {trip.budget > 0 && <span className="text-slate-400 text-sm">of {formatMoney(trip.budget)} budget</span>}
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-slate-400 text-sm">Bookings</span>
          <strong className="text-[1.4rem] leading-tight">{trip.items.length}</strong>
          <span className="text-slate-400 text-sm">{pending} pending</span>
        </div>
        {kinds.map((kind) => (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-1" key={kind}>
            <span className="text-slate-400 text-sm flex items-center gap-1.5 capitalize">
              {icons[kind]} {plural[kind]}
            </span>
            <strong className="text-[1.4rem] leading-tight">{trip.items.filter((item) => item.kind === kind).length}</strong>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center my-5">
        {kinds.map((kind) => (
          <button
            key={kind}
            onClick={() => setAdding(kind)}
            className="flex items-center gap-1.5 bg-sky-400 border-sky-400 text-sky-950 font-semibold px-3 py-1.5 rounded-lg border hover:border-sky-300 transition-colors capitalize"
          >
            <Plus size={16} /> {kind}
          </button>
        ))}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ItemKind | 'all')}
          className="bg-slate-900 border-slate-700 text-slate-200 px-3 py-2 rounded-lg border ml-auto"
        >
          <option value="all">All bookings</option>
          {kinds.map((kind) => (
            <option key={kind} value={kind}>
              {plural[kind]} only
            </option>
          ))}
        </select>
      </div>

      {adding && (
        <ItemForm kind={adding} onSave={upsert} onCancel={() => setAdding(null)} />
      )}
      {editing && (
        <ItemForm
          kind={editing.kind}
          item={editing}
          onSave={upsert}
          onCancel={() => setEditing(null)}
        />
      )}

      {days.length === 0 && <p className="text-slate-400 text-sm">No bookings yet. Add a flight to get started.</p>}

      <div className="flex flex-col gap-6">
        {days.map(([key, items]) => (
          <div key={key}>
            <h3 className="text-sky-400 uppercase tracking-wide text-base mt-2 mb-3">{formatDay(key)}</h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <TripItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditing(item)}
                  onDelete={() => remove(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
