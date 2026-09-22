import type { Trip } from '../types'
import { calculateSpent, daysUntil, formatMoney, tripStatus } from '../format'

interface Props {
  trip: Trip
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export const TripCard = ({ trip, onOpen, onEdit, onDelete }: Props) => {
  const status = tripStatus(trip.start, trip.end)
  const countdown = daysUntil(trip.start)
  const spent = calculateSpent(trip.items)

  const badgeColor =
    status === 'active' ? 'text-green-300 border-green-800' :
    status === 'upcoming' ? 'text-yellow-300 border-yellow-800' :
    'text-red-300 border-red-900'

  return (
    <article className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <span className={`text-[0.7rem] uppercase tracking-wide px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {status}
        </span>
        {status === 'upcoming' && countdown !== null && (
          <span className="text-slate-400 text-sm">in {countdown} days</span>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold m-0">{trip.name}</h2>
        <p className="text-slate-400 text-sm m-0 mt-1">
          {trip.destination} &middot; {trip.start} &rarr; {trip.end}
        </p>
        <p className="text-slate-400 text-sm m-0 mt-1">
          {trip.items.length} bookings &middot; {formatMoney(spent)}
          {trip.budget > 0 ? ` of ${formatMoney(trip.budget)}` : ''}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap items-center mt-2">
        <button
          className="bg-sky-400 border-sky-400 text-sky-950 font-semibold px-3 py-1.5 rounded-lg border hover:border-sky-300 transition-colors"
          onClick={onOpen}
        >
          Open
        </button>
        <button
          className="bg-slate-900 border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border hover:border-sky-400 transition-colors"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-slate-900 border-red-900 text-red-300 px-3 py-1.5 rounded-lg border hover:border-red-500 transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
