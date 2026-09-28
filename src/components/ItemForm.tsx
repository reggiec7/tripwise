import { useState } from 'react'
import type { BookingStatus, ItemKind, TripItem, Flight, Hotel, Activity } from '../types'
import { emptyItem } from '../types'
import { FlightFields } from './FlightFields'
import { HotelFields } from './HotelFields'
import { ActivityFields } from './ActivityFields'

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

  const labelClass = "flex flex-col gap-1 text-[0.8rem] text-slate-400 mb-2"
  const inputClass = "bg-[#0b1220] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-400 mt-1"

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
          <FlightFields draft={draft as Flight} update={update} labelClass={labelClass} inputClass={inputClass} />
        )}

        {draft.kind === 'hotel' && (
          <HotelFields draft={draft as Hotel} update={update} labelClass={labelClass} inputClass={inputClass} />
        )}

        {draft.kind === 'activity' && (
          <ActivityFields draft={draft as Activity} update={update} labelClass={labelClass} inputClass={inputClass} />
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
