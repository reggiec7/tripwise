import type { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'

const labelClass = "flex flex-col gap-1 text-[0.8rem] text-slate-400 mb-2"
const inputClass = "bg-[#0b1220] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-400 mt-1"

export type FieldProps<T extends ElementType = 'input'> = {
  label: ReactNode
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'label' | 'as'>

export function Field<T extends ElementType = 'input'>({
  label,
  as,
  children,
  ...props
}: FieldProps<T>) {
  const Component = as || 'input'
  return (
    <label className={labelClass}>
      {label}
      <Component className={inputClass} {...props}>
        {children}
      </Component>
    </label>
  )
}
