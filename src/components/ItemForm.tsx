import { useState } from 'react'
import type { BookingStatus, ItemKind, TripItem } from '../types'
import { emptyItem } from '../types'

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
      className="card form"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({ ...draft, title: draft.title.trim() || label.title })
      }}
    >
      <h3>
        {item ? 'Edit' : 'Add'} {draft.kind}
      </h3>
      <div className="grid">
        <label>
          {label.title}
          <input required value={draft.title} onChange={(e) => update({ title: e.target.value })} />
        </label>
        <label>
          Confirmation #
          <input
            value={draft.confirmation}
            onChange={(e) => update({ confirmation: e.target.value })}
          />
        </label>
        <label>
          {label.start}
          <input
            type="datetime-local"
            required
            value={draft.start}
            onChange={(e) => update({ start: e.target.value })}
          />
        </label>
        <label>
          {label.end}
          <input
            type="datetime-local"
            value={draft.end}
            onChange={(e) => update({ end: e.target.value })}
          />
        </label>

        {draft.kind === 'flight' && (
          <>
            <label>
              Airline
              <input
                value={draft.airline}
                onChange={(e) => update({ airline: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              Flight #
              <input
                value={draft.flightNumber}
                onChange={(e) => update({ flightNumber: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              From
              <input
                value={draft.from}
                placeholder="JFK"
                onChange={(e) => update({ from: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              To
              <input
                value={draft.to}
                placeholder="OGG"
                onChange={(e) => update({ to: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              Seat
              <input
                value={draft.seat}
                onChange={(e) => update({ seat: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        {draft.kind === 'hotel' && (
          <>
            <label>
              Address
              <input
                value={draft.address}
                onChange={(e) => update({ address: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              Room type
              <input
                value={draft.roomType}
                onChange={(e) => update({ roomType: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        {draft.kind === 'activity' && (
          <>
            <label>
              Location
              <input
                value={draft.location}
                onChange={(e) => update({ location: e.target.value } as Partial<TripItem>)}
              />
            </label>
            <label>
              Category
              <input
                value={draft.category}
                placeholder="Dinner, tour, spa…"
                onChange={(e) => update({ category: e.target.value } as Partial<TripItem>)}
              />
            </label>
          </>
        )}

        <label>
          Cost (USD)
          <input
            type="number"
            min="0"
            value={draft.cost || ''}
            onChange={(e) => update({ cost: Number(e.target.value) })}
          />
        </label>
        <label>
          Status
          <select
            value={draft.status}
            onChange={(e) => update({ status: e.target.value as BookingStatus })}
          >
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      <label>
        Notes
        <textarea rows={2} value={draft.notes} onChange={(e) => update({ notes: e.target.value })} />
      </label>
      <div className="row">
        <button type="submit" className="primary">
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
