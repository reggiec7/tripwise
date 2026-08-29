import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import type { Trip } from './types'
import { loadTrips, saveTrips } from './storage'
import { daysUntil, formatMoney, tripStatus } from './format'
import { TripForm } from './components/TripForm'
import { TripDetail } from './components/TripDetail'

const order = { active: 0, upcoming: 1, past: 2 }

function App() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Trip | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

  const selected = trips.find((trip) => trip.id === selectedId) ?? null

  const sorted = useMemo(
    () =>
      trips.slice().sort((a, b) => {
        const byStatus = order[tripStatus(a.start, a.end)] - order[tripStatus(b.start, b.end)]
        return byStatus !== 0 ? byStatus : a.start.localeCompare(b.start)
      }),
    [trips],
  )

  const upsert = (trip: Trip) => {
    setTrips((prev) =>
      prev.some((existing) => existing.id === trip.id)
        ? prev.map((existing) => (existing.id === trip.id ? trip : existing))
        : [...prev, trip],
    )
    setCreating(false)
    setEditing(null)
  }

  const exportTrips = () => {
    const blob = new Blob([JSON.stringify(trips, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tripwise-trips.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTrips = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (Array.isArray(parsed)) setTrips(parsed as Trip[])
    } catch {
      alert('That file could not be read as TripWise data.')
    }
  }

  if (selected) {
    return (
      <main className="app">
        <TripDetail trip={selected} onBack={() => setSelectedId(null)} onChange={upsert} />
      </main>
    )
  }

  return (
    <main className="app">
      <header className="detail-header">
        <div>
          <h1>TripWise</h1>
          <p className="muted">Every flight, hotel, and activity for every trip — in one timeline.</p>
        </div>
        <div className="row">
          <button className="primary" onClick={() => setCreating(true)}>
            + New trip
          </button>
          <button onClick={exportTrips} disabled={trips.length === 0}>
            Export
          </button>
          <button onClick={() => fileInput.current?.click()}>Import</button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importTrips(file)
              e.target.value = ''
            }}
          />
        </div>
      </header>

      {creating && <TripForm onSave={upsert} onCancel={() => setCreating(false)} />}
      {editing && (
        <TripForm trip={editing} onSave={upsert} onCancel={() => setEditing(null)} />
      )}

      {trips.length === 0 && !creating && (
        <p className="muted">No trips yet — start with your honeymoon.</p>
      )}

      <div className="trip-grid">
        {sorted.map((trip) => {
          const status = tripStatus(trip.start, trip.end)
          const countdown = daysUntil(trip.start)
          const spent = trip.items
            .filter((item) => item.status !== 'cancelled')
            .reduce((sum, item) => sum + (item.cost || 0), 0)
          return (
            <article key={trip.id} className="card trip-card">
              <div className="row space">
                <span className={`badge ${status}`}>{status}</span>
                {status === 'upcoming' && countdown !== null && (
                  <span className="muted">in {countdown} days</span>
                )}
              </div>
              <h2>{trip.name}</h2>
              <p className="muted">
                {trip.destination} · {trip.start} → {trip.end}
              </p>
              <p className="muted">
                {trip.items.length} bookings · {formatMoney(spent)}
                {trip.budget > 0 ? ` of ${formatMoney(trip.budget)}` : ''}
              </p>
              <div className="row">
                <button className="primary" onClick={() => setSelectedId(trip.id)}>
                  Open
                </button>
                <button onClick={() => setEditing(trip)}>Edit</button>
                <button
                  className="danger"
                  onClick={() =>
                    setTrips((prev) => prev.filter((existing) => existing.id !== trip.id))
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default App
