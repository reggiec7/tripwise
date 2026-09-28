import { useState } from 'react'
import type { BookingStatus, ItemKind, TripItem } from '../types'
import { emptyItem } from '../types'
import { labelClass, inputClass } from './formClasses'

interface Props {
  kind: ItemKind
  item?: TripItem
  onSave: (item: TripItem) => void
  onCancel: () => void
}

const labels: Record<ItemKind, { title: string; start: string; end: string }> = {
  flight: { title: 'Flight name', start: 'Departure', end: 'Arrival' },
  hotel: { title: 'Hotel name', start: 'Check-in', end: 'Check-out' },
  activity: { title: 'Activity', start: 'Starts', end: 'Ends' },
}

export const ItemForm = ({ kind, item, onSave, onCancel }: Props) => {
  const [draft, setDraft] = useState<TripItem>(item ?? emptyItem(kind))
  const label = labels[draft.kind]

  const update = (patch: Partial<TripItem>) =>
    setDraft((prev) => ({ ...prev, ...patch }) as TripItem)

  return (
    <form
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({ ...draft, title: draft.title.trim() || label.title })
      }}
    >
      <h3 className="text-base text-sky-400 uppercase tracking-wide m-0 mb-4 mt-2">
        {item ? 'Edit' : 'Add'} {draft.kind}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-3 gap-y-1">
        <label className={labelClass}>
          {label.title}
          <input className={inputClass} required value={draft.title} onChange={(e) => update({ title: e.target.value })} />
        </label>
        <label className={labelClass}>
          Confirmation #
          <input
            className={inputClass}
            value={draft.confirmation}
            onChange={(e) => update({ confirmation: e.target.value })}
          />
        </label>
        <label className={labelClass}>
          {label.start}
          <input
            className={inputClass}
            type="datetime-local"
            required
            value={draft.start}
            onChange={(e) => update({ start: e.target.value })}
          />
        </label>
        <label className={labelClass}>
          {label.end}
          <input
            className={inputClass}
            type="datetime-local"
            value={draft.end}
            onChange={(e) => update({ end: e.target.value })}
          />
        </label>

        {draft.kind === 'flight' && (
          <>
            <label className={labelClass}>
              Airline
              <input
                className={inputClass}
                value={draft.airline}
                onChange={(e) => update({ airline: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              Flight #
              <input
                className={inputClass}
                value={draft.flightNumber}
                onChange={(e) => update({ flightNumber: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              From
              <input
                className={inputClass}
                value={draft.from}
                placeholder="JFK"
                onChange={(e) => update({ from: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              To
              <input
                className={inputClass}
                value={draft.to}
                placeholder="OGG"
                onChange={(e) => update({ to: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              Seat
              <input
                className={inputClass}
                value={draft.seat}
                onChange={(e) => update({ seat: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        {draft.kind === 'hotel' && (
          <>
            <label className={labelClass}>
              Address
              <input
                className={inputClass}
                value={draft.address}
                onChange={(e) => update({ address: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              Room type
              <input
                className={inputClass}
                value={draft.roomType}
                onChange={(e) => update({ roomType: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        {draft.kind === 'activity' && (
          <>
            <label className={labelClass}>
              Location
              <input
                className={inputClass}
                value={draft.location}
                onChange={(e) => update({ location: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label className={labelClass}>
              Category
              <input
                className={inputClass}
                value={draft.category}
                placeholder="Dinner, tour, spa…"
                onChange={(e) => update({ category: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        <label className={labelClass}>
          Cost (USD)
          <input
            className={inputClass}
            type="number"
            min="0"
            value={draft.cost || ''}
            onChange={(e) => update({ cost: Number(e.target.value) })}
          />
        </label>
        <label className={labelClass}>
          Status
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) => update({ status: e.target.value as BookingStatus })}
          >
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      <label className={labelClass}>
        Notes
        <textarea className={inputClass} rows={2} value={draft.notes} onChange={(e) => update({ notes: e.target.value })} />
      </label>
      <div className="flex gap-2 flex-wrap items-center mt-3">
        <button type="submit" className="bg-sky-400 border-sky-400 text-sky-950 font-semibold px-3 py-1.5 rounded-lg border hover:border-sky-300 transition-colors">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-slate-900 border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border hover:border-sky-400 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
