import { useState } from 'react'
import type { Trip } from '../types'
import { emptyTrip } from '../types'
import { labelClass, inputClass } from './formClasses'

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
        <label className={labelClass}>
          Trip name
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Honeymoon"
          />
        </label>
        <label className={labelClass}>
          Destination
          <input
            className={inputClass}
            required
            value={draft.destination}
            onChange={(e) => update('destination', e.target.value)}
            placeholder="Maui, Hawaii"
          />
        </label>
        <label className={labelClass}>
          Start date
          <input
            className={inputClass}
            type="date"
            required
            value={draft.start}
            onChange={(e) => update('start', e.target.value)}
          />
        </label>
        <label className={labelClass}>
          End date
          <input
            className={inputClass}
            type="date"
            required
            value={draft.end}
            onChange={(e) => update('end', e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Travelers
          <input
            className={inputClass}
            value={draft.travelers}
            onChange={(e) => update('travelers', e.target.value)}
            placeholder="Reggie + spouse"
          />
        </label>
        <label className={labelClass}>
          Budget (USD)
          <input
            className={inputClass}
            type="number"
            min="0"
            value={draft.budget || ''}
            onChange={(e) => update('budget', Number(e.target.value))}
          />
        </label>
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
