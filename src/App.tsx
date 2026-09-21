import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import './App.css'
import { tripSchema, type Trip } from './types'
import { loadTrips, saveTrips } from './storage'
import { tripStatus } from './format'
import { TripForm } from './components/TripForm'
import { TripDetail } from './components/TripDetail'
import { TripCard } from './components/TripCard'
import { Plus, Download, Upload } from 'lucide-react'

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
      const tripsArraySchema = z.array(tripSchema)
      const validated = tripsArraySchema.parse(parsed)
      setTrips(validated)
    } catch {
      alert('That file could not be read as TripWise data.')
    }
  }

  if (selected) {
    return (
      <main className="max-w-4xl mx-auto px-5 py-8 pb-16">
        <TripDetail trip={selected} onBack={() => setSelectedId(null)} onChange={upsert} />
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-5 py-8 pb-16">
      <header className="flex justify-between items-start gap-4 flex-wrap my-4 mb-6">
        <div>
          <h1 className="text-[1.9rem] m-0 font-bold">TripWise</h1>
          <p className="text-slate-400 text-sm m-0 mt-1">Every flight, hotel, and activity for every trip — in one timeline.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            className="flex items-center gap-1.5 bg-sky-400 border-sky-400 text-sky-950 font-semibold px-3 py-1.5 rounded-lg border hover:border-sky-300 transition-colors"
            onClick={() => setCreating(true)}
          >
            <Plus size={16} /> New trip
          </button>
          <button
            className="flex items-center gap-1.5 bg-slate-900 border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border hover:border-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={exportTrips}
            disabled={trips.length === 0}
          >
            <Download size={16} /> Export
          </button>
          <button
            className="flex items-center gap-1.5 bg-slate-900 border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border hover:border-sky-400 transition-colors"
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={16} /> Import
          </button>
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
        <p className="text-slate-400 text-sm">No trips yet — start with your honeymoon.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {sorted.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onOpen={() => setSelectedId(trip.id)}
            onEdit={() => setEditing(trip)}
            onDelete={() =>
              setTrips((prev) => prev.filter((existing) => existing.id !== trip.id))
            }
          />
        ))}
      </div>
    </main>
  )
}

export default App
