import { readFile } from "node:fs/promises"
import path from "node:path"

export type TeamDriver = {
  driverNumber: number
  fullName: string
  firstName: string
  lastName: string
  headshotUrl: string
  portraitUrl?: string
}

export type TeamContent = {
  slug: string
  name: string
  positionStart: number
  position: number
  pointsStart: number
  points: number
  teamColor: string
  teamSurface: string
  carImage?: string
  drivers: string[]
  roster: TeamDriver[]
  history: string
  currentSituation: string
  identity: string
  outlook: string
}

export async function loadTeams(): Promise<TeamContent[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "f1",
    "teams-unified.json"
  )
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw) as TeamContent[]
}
