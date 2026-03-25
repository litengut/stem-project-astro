import { columns } from "./team-columns"
import { driverColumns } from "./driver-columns"
import { type StandingsPageData } from "./types"
import { DataTable } from "./data-table"

export default function DemoPage({ data }: { data: StandingsPageData }) {
  const { drivers, teams, updatedAt } = data

  return (
    <div className="container mx-auto space-y-10 px-4 py-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Driver Standings
          </h2>
          <p className="text-sm text-muted-foreground">Updated {updatedAt}</p>
        </div>
        <DataTable columns={driverColumns} data={drivers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Team Standings</h2>
        <DataTable columns={columns} data={teams} />
      </section>

      <p className="text-xs text-muted-foreground">
        Session form uses the latest race results: gold = win, silver = P2,
        bronze = P3, green = better than average, amber = worse, pink = DNF,
        blue = DNS.
      </p>
    </div>
  )
}
