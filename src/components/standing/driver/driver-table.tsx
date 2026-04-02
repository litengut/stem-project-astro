import { DataTable } from "../data-table"
import { smallDriverColumns } from "./small-driver-columns"
import { driverColumns } from "./driver-columns"
import type { DriverStandingRow } from "../types"

export function SmallDriverTable({
  drivers,
}: {
  drivers: DriverStandingRow[]
}) {
  return <DataTable columns={smallDriverColumns} data={drivers} />
}

export function DriverTable({ drivers }: { drivers: DriverStandingRow[] }) {
  return <DataTable columns={driverColumns} data={drivers} />
}
