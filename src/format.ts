export const formatMoney = (value: number): string =>
  value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const formatDateTime = (value: string): string => {
  if (!value) return 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const hasTime = value.includes('T')
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(hasTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  })
}

export const dayKey = (value: string): string => (value ? value.slice(0, 10) : '')

export const formatDay = (key: string): string => {
  if (!key) return 'Unscheduled'
  const date = new Date(`${key}T12:00:00`)
  if (Number.isNaN(date.getTime())) return key
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export const daysUntil = (value: string): number | null => {
  if (!value) return null
  const target = new Date(`${dayKey(value)}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export const tripStatus = (start: string, end: string): 'upcoming' | 'active' | 'past' => {
  const until = daysUntil(start)
  const untilEnd = daysUntil(end)
  if (until !== null && until > 0) return 'upcoming'
  if (untilEnd !== null && untilEnd < 0) return 'past'
  return 'active'
}
