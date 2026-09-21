import { useState } from 'react'
import type { Trip } from '../types'
import { emptyTrip } from '../types'
import { Field } from './Field'

interface Props {
  trip?: Trip
  onSave: (trip: Trip) => void
  onCancel: () => void
}

export const TripForm = ({ trip, onSave, onCancel }: Props) => {
  const [draft, setDraft] = useState<Trip>(trip ?? emptyTrip())

  const update = <K extends keyof Trip>(key: K, value: Trip[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  return (
    <form
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({ ...draft, name: draft.name.trim() || draft.destination.trim() || 'Untitled trip' })
      }}
    >
      <h2 className="text-xl font-semibold m-0 mb-4">{trip ? 'Edit trip' : 'New trip'}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-3 gap-y-1">
        <Field
          label="Trip name"
          value={draft.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Honeymoon"
        />
        <Field
          label="Destination"
          required
          value={draft.destination}
          onChange={(e) => update('destination', e.target.value)}
          placeholder="Maui, Hawaii"
        />
        <Field
          label="Start date"
          type="date"
          required
          value={draft.start}
          onChange={(e) => update('start', e.target.value)}
        />
        <Field
          label="End date"
          type="date"
          required
          value={draft.end}
          onChange={(e) => update('end', e.target.value)}
        />
        <Field
          label="Travelers"
          value={draft.travelers}
          onChange={(e) => update('travelers', e.target.value)}
          placeholder="Reggie + spouse"
        />
        <Field
          label="Budget (USD)"
          type="number"
          min="0"
          value={draft.budget || ''}
          onChange={(e) => update('budget', Number(e.target.value))}
        />
      </div>
      <div className="flex gap-2 flex-wrap items-center mt-3">
        <button type="submit" className="bg-sky-400 border-sky-400 text-sky-950 font-semibold px-3 py-1.5 rounded-lg border hover:border-sky-300 transition-colors">
          Save trip
        </button>
        <button type="button" onClick={onCancel} className="bg-slate-900 border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border hover:border-sky-400 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
