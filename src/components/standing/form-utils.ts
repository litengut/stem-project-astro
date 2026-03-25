import type { FormStatus } from "./types"

export function formClass(status: FormStatus) {
  if (status === "win") return "bg-[#D4AF37] ring-[#F7E7A1]"
  if (status === "second") return "bg-[#C0C0C0] ring-[#E8E8E8]"
  if (status === "third") return "bg-[#CD7F32] ring-[#E7B17A]"
  if (status === "better") return "bg-emerald-500 ring-emerald-300"
  if (status === "worse") return "bg-amber-400 ring-amber-200"
  if (status === "dnf") return "bg-fuchsia-500 ring-fuchsia-300"
  if (status === "none") return "bg-gray-500 ring-gray-300"
  return "bg-sky-500 ring-sky-300"
}

export function formLabel(status: FormStatus) {
  if (status === "win") return "WIN"
  if (status === "second") return "P2"
  if (status === "third") return "P3"
  if (status === "better") return "BET"
  if (status === "worse") return "WRS"
  if (status === "dnf") return "DNF"
  if (status === "none") return "NONE"
  return "DNS"
}
