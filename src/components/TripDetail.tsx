import { useMemo, useState } from 'react'
import type { ItemKind, Trip, TripItem } from '../types'
import { dayKey, daysUntil, formatDateTime, formatDay, formatMoney } from '../format'
import { ItemForm } from './ItemForm'

interface Props {
  trip: Trip
  onBack: () => void
  onChange: (trip: Trip) => void
}

const icons: Record<ItemKind, string> = { flight: '✈', hotel: '🏨', activity: '🎟' }
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

  const spent = trip.items
    .filter((item) => item.status !== 'cancelled')
    .reduce((sum, item) => sum + (item.cost || 0), 0)
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
      <button onClick={onBack}>← All trips</button>
      <header className="detail-header">
        <div>
          <h1>{trip.name}</h1>
          <p className="muted">
            {trip.destination} · {trip.start} → {trip.end}
            {trip.travelers ? ` · ${trip.travelers}` : ''}
          </p>
        </div>
        {countdown !== null && countdown > 0 && (
          <div className="countdown">
            <strong>{countdown}</strong>
            <span>days to go</span>
          </div>
        )}
      </header>

      <div className="stats">
        <div className="card stat">
          <span className="muted">Booked</span>
          <strong>{formatMoney(spent)}</strong>
          {trip.budget > 0 && <span className="muted">of {formatMoney(trip.budget)} budget</span>}
        </div>
        <div className="card stat">
          <span className="muted">Bookings</span>
          <strong>{trip.items.length}</strong>
          <span className="muted">{pending} pending</span>
        </div>
        {kinds.map((kind) => (
          <div className="card stat" key={kind}>
            <span className="muted">
              {icons[kind]} {plural[kind]}
            </span>
            <strong>{trip.items.filter((item) => item.kind === kind).length}</strong>
          </div>
        ))}
      </div>

      <div className="row toolbar">
        {kinds.map((kind) => (
          <button key={kind} onClick={() => setAdding(kind)} className="primary">
            + {kind}
          </button>
        ))}
        <select value={filter} onChange={(e) => setFilter(e.target.value as ItemKind | 'all')}>
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

      {days.length === 0 && <p className="muted">No bookings yet. Add a flight to get started.</p>}

      {days.map(([key, items]) => (
        <div key={key} className="day">
          <h3>{formatDay(key)}</h3>
          {items.map((item) => (
            <article key={item.id} className={`card item ${item.status}`}>
              <div className="item-main">
                <span className="icon">{icons[item.kind]}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">
                    {formatDateTime(item.start)}
                    {item.end ? ` → ${formatDateTime(item.end)}` : ''}
                  </p>
                  {item.kind === 'flight' && (
                    <p className="muted">
                      {[item.airline, item.flightNumber].filter(Boolean).join(' ')}
                      {item.from && item.to ? ` · ${item.from} → ${item.to}` : ''}
                      {item.seat ? ` · seat ${item.seat}` : ''}
                    </p>
                  )}
                  {item.kind === 'hotel' && (
                    <p className="muted">
                      {[item.address, item.roomType].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {item.kind === 'activity' && (
                    <p className="muted">
                      {[item.location, item.category].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {item.confirmation && <p className="muted">Conf # {item.confirmation}</p>}
                  {item.notes && <p className="notes">{item.notes}</p>}
                </div>
              </div>
              <div className="item-side">
                <span className={`badge ${item.status}`}>{item.status}</span>
                {item.cost > 0 && <span>{formatMoney(item.cost)}</span>}
                <div className="row">
                  <button onClick={() => setEditing(item)}>Edit</button>
                  <button className="danger" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ))}
    </section>
  )
}
