import type { TripItem } from '../types'
import { formatDateTime, formatMoney } from '../format'
import { Plane, Hotel, Ticket } from 'lucide-react'

interface Props {
  item: TripItem
  onEdit: () => void
  onDelete: () => void
}

const icons = {
  flight: <Plane />,
  hotel: <Hotel />,
  activity: <Ticket />,
}

function formatItemDetails(item: TripItem) {
  switch (item.kind) {
    case 'flight':
      return (
        <>
          {[item.airline, item.flightNumber].filter(Boolean).join(' ')}
          {item.from && item.to ? ` · ${item.from} → ${item.to}` : ''}
          {item.seat ? ` · seat ${item.seat}` : ''}
        </>
      )
    case 'hotel':
      return [item.address, item.roomType].filter(Boolean).join(' · ')
    case 'activity':
      return [item.location, item.category].filter(Boolean).join(' · ')
    default:
      return null
  }
}

export const TripItemCard = ({ item, onEdit, onDelete }: Props) => {
  const isCancelled = item.status === 'cancelled'
  const badgeColor =
    item.status === 'confirmed' ? 'text-green-300 border-green-800' :
    item.status === 'pending' ? 'text-yellow-300 border-yellow-800' :
    'text-red-300 border-red-900'

  return (
    <article className={`bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between gap-4 flex-wrap shadow-sm ${isCancelled ? 'opacity-55' : ''}`}>
      <div className="flex gap-3">
        <span className="text-2xl mt-0.5 text-slate-300">{icons[item.kind]}</span>
        <div>
          <strong className="text-lg text-slate-100 block mb-0.5">{item.title}</strong>
          <p className="text-slate-400 text-sm m-0">
            {formatDateTime(item.start)}
            {item.end ? ` → ${formatDateTime(item.end)}` : ''}
          </p>
          {formatItemDetails(item) && (
            <p className="text-slate-400 text-sm m-0">
              {formatItemDetails(item)}
            </p>
          )}
          {item.confirmation && <p className="text-slate-400 text-sm m-0">Conf # {item.confirmation}</p>}
          {item.notes && <p className="text-slate-300 text-[0.85rem] border-l-2 border-slate-600 pl-2 mt-1.5">{item.notes}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className={`text-[0.7rem] uppercase tracking-wide px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {item.status}
        </span>
        {item.cost > 0 && <span className="font-semibold text-slate-200">{formatMoney(item.cost)}</span>}
        <div className="flex gap-2 flex-wrap items-center mt-auto">
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
      </div>
    </article>
  )
}
