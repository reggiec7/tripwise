import { useState } from 'react'
import type { Trip } from '../types'
import { emptyTrip } from '../types'

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
      className="card form"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({ ...draft, name: draft.name.trim() || draft.destination.trim() || 'Untitled trip' })
      }}
    >
      <h2>{trip ? 'Edit trip' : 'New trip'}</h2>
      <div className="grid">
        <label>
          Trip name
          <input
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Honeymoon"
          />
        </label>
        <label>
          Destination
          <input
            required
            value={draft.destination}
            onChange={(e) => update('destination', e.target.value)}
            placeholder="Maui, Hawaii"
          />
        </label>
        <label>
          Start date
          <input
            type="date"
            required
            value={draft.start}
            onChange={(e) => update('start', e.target.value)}
          />
        </label>
        <label>
          End date
          <input
            type="date"
            required
            value={draft.end}
            onChange={(e) => update('end', e.target.value)}
          />
        </label>
        <label>
          Travelers
          <input
            value={draft.travelers}
            onChange={(e) => update('travelers', e.target.value)}
            placeholder="Reggie + spouse"
          />
        </label>
        <label>
          Budget (USD)
          <input
            type="number"
            min="0"
            value={draft.budget || ''}
            onChange={(e) => update('budget', Number(e.target.value))}
          />
        </label>
      </div>
      <div className="row">
        <button type="submit" className="primary">
          Save trip
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
