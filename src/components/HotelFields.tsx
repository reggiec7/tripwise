import type { Hotel, TripItem } from '../types'

interface HotelFieldsProps {
  draft: Hotel
  update: (patch: Partial<TripItem>) => void
  labelClass: string
  inputClass: string
}

export const HotelFields = ({ draft, update, labelClass, inputClass }: HotelFieldsProps) => {
  return (
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
  )
}
