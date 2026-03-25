// @chatgpt
import { readFile } from "node:fs/promises"
import path from "node:path"

import type { StandingsPageData, StandingsTableData } from "./types"

export async function getStandingsPageData(): Promise<StandingsPageData> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "f1",
    "standings-table-data.json"
  )

  const raw = await readFile(filePath, "utf-8")
  const parsed = JSON.parse(raw) as StandingsTableData

  return {
    raceLabels: parsed.raceLabels,
    updatedAt: parsed.updatedAt,
    drivers: parsed.drivers,
    teams: parsed.teams,
  }
}
