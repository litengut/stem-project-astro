"use client"

import { formClass, formLabel } from "./form-utils"
import type { FormStatus } from "./types"

export function Form({ form }: { form: FormStatus[] }) {
  const fiveform = [...form, ...(Array(5).fill("none") as FormStatus[])].slice(
    0,
    5
  )
  return (
    <div className="flex gap-1.5">
      {fiveform.map((status, index) => (
        <Status key={`${index}-${status}`} status={status} />
      ))}
    </div>
  )
}

export function Status({ status }: { status: FormStatus }) {
  const formclass = formClass(status)
  const label = formLabel(status)
  return (
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full ring-1 ${formclass}`}
      aria-label={label}
    />
  )
}
