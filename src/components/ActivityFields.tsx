import type { Activity, TripItem } from '../types'

interface ActivityFieldsProps {
  draft: Activity
  update: (patch: Partial<TripItem>) => void
  labelClass: string
  inputClass: string
}

export const ActivityFields = ({ draft, update, labelClass, inputClass }: ActivityFieldsProps) => {
  return (
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
  )
}
