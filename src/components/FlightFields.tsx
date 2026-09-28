import type { Flight, TripItem } from '../types'

interface FlightFieldsProps {
  draft: Flight
  update: (patch: Partial<TripItem>) => void
  labelClass: string
  inputClass: string
}

export const FlightFields = ({ draft, update, labelClass, inputClass }: FlightFieldsProps) => {
  return (
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
  )
}
