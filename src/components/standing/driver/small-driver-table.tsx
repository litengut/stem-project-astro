import { DataTable } from "../data-table"
import { smallDriverColumns } from "./small-driver-columns"
import type { DriverStandingRow } from "../types"

export function SmallDriverTable({
  drivers,
}: {
  drivers: DriverStandingRow[]
}) {
  return <DataTable columns={smallDriverColumns} data={drivers} />
}
