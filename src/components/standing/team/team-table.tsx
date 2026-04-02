import { DataTable } from "../data-table"
import { smallTeamColumns } from "./small-team-columns"
import { columns as TeamColumns } from "./team-columns"
import type { TeamStandingRow } from "../types"

export function SmallDriverTable({ teams }: { teams: TeamStandingRow[] }) {
  return <DataTable columns={smallTeamColumns} data={teams} />
}

export function DriverTable({ teams }: { teams: TeamStandingRow[] }) {
  return <DataTable columns={TeamColumns} data={teams} />
}
