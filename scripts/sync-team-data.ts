// this file is enterly chatgpted I didn't border it to write it myself, because it is just annoying.
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type TeamStanding = {
  team_name: string
  position_start: number
  position_current: number
  points_start: number
  points_current: number
}

type DriverApi = {
  driver_number: number
  full_name: string
  first_name: string
  last_name: string
  team_name: string
  team_colour?: string
  headshot_url: string
}

const buildPortraitUrl = (teamName: string, headshotUrl: string) => {
  const teamSlug = teamName.toLowerCase().replace(/[^a-z0-9]+/g, "")

  const codeMatch = headshotUrl.match(/\/([a-z0-9]{8})\.png/i)
  if (!codeMatch) {
    return undefined
  }

  const code = codeMatch[1].toLowerCase()
  return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1740000001/common/f1/2026/${teamSlug}/${code}/2026${teamSlug}${code}right.webp`
}

type TeamNarrative = {
  slug: string
  name: string
  history: string
  currentSituation: string
  identity: string
  outlook: string
}

const TEAM_THEME: Record<string, { primary: string; surface: string }> = {
  "Red Bull Racing": { primary: "#1E5BC6", surface: "#0A1730" },
  Ferrari: { primary: "#DC0000", surface: "#240808" },
  Mercedes: { primary: "#00D2BE", surface: "#082423" },
  McLaren: { primary: "#FF8000", surface: "#251607" },
  "Aston Martin": { primary: "#229971", surface: "#0C1E19" },
  Williams: { primary: "#1868DB", surface: "#0A1B3A" },
  Alpine: { primary: "#00A1E8", surface: "#081F30" },
  Audi: { primary: "#F50537", surface: "#2A0A12" },
  "Racing Bulls": { primary: "#6C98FF", surface: "#101D35" },
  "Haas F1 Team": { primary: "#9C9FA2", surface: "#1A1C1F" },
  Cadillac: { primary: "#909090", surface: "#1A1A1A" },
}

const TEAM_CAR_IMAGE: Record<string, string> = {
  Alpine:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/alpine/2026alpinecarright.webp",
  "Aston Martin":
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright.webp",
  Audi: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/audi/2026audicarright.webp",
  Cadillac:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaccarright.webp",
  Ferrari:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp",
  "Haas F1 Team":
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamcarright.webp",
  McLaren:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp",
  Mercedes:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp",
  "Racing Bulls":
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright.webp",
  "Red Bull Racing":
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp",
  Williams:
    "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/williams/2026williamscarright.webp",
}

const titleCaseName = (name: string) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`)
  }
  return (await response.json()) as T
}

async function run() {
  const root = process.cwd()
  const narrativesPath = path.join(root, "public", "f1", "teams-content.json")
  const outputPath = path.join(root, "public", "f1", "teams-unified.json")

  const [standings, drivers, narrativeRaw] = await Promise.all([
    getJson<TeamStanding[]>(
      "https://api.openf1.org/v1/championship_teams?session_key=latest"
    ),
    getJson<DriverApi[]>(
      "https://api.openf1.org/v1/drivers?session_key=latest"
    ),
    readFile(narrativesPath, "utf-8"),
  ])

  const narratives = JSON.parse(narrativeRaw) as TeamNarrative[]
  const narrativesByName = new Map(narratives.map((item) => [item.name, item]))

  const driversByTeam = new Map<string, DriverApi[]>()
  for (const driver of drivers) {
    const list = driversByTeam.get(driver.team_name) ?? []
    list.push(driver)
    driversByTeam.set(driver.team_name, list)
  }

  const unified = standings
    .slice()
    .sort((a, b) => a.position_current - b.position_current)
    .map((standing) => {
      const narrative = narrativesByName.get(standing.team_name)
      const roster = (driversByTeam.get(standing.team_name) ?? [])
        .slice()
        .sort((a, b) => a.driver_number - b.driver_number)

      const fallbackPrimary = roster[0]?.team_colour
        ? `#${roster[0].team_colour}`
        : "#1f2937"
      const theme = TEAM_THEME[standing.team_name] ?? {
        primary: fallbackPrimary,
        surface: "#101828",
      }

      return {
        slug:
          narrative?.slug ??
          standing.team_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: standing.team_name,
        positionStart: standing.position_start,
        position: standing.position_current,
        pointsStart: Math.round(standing.points_start),
        points: Math.round(standing.points_current),
        teamColor: theme.primary,
        teamSurface: theme.surface,
        carImage: TEAM_CAR_IMAGE[standing.team_name],
        drivers: roster.map((driver) => titleCaseName(driver.full_name)),
        roster: roster.map((driver) => ({
          driverNumber: driver.driver_number,
          fullName: titleCaseName(driver.full_name),
          firstName: driver.first_name,
          lastName: driver.last_name,
          headshotUrl: driver.headshot_url,
          portraitUrl: buildPortraitUrl(
            standing.team_name,
            driver.headshot_url
          ),
        })),
        history: narrative?.history ?? "",
        currentSituation: narrative?.currentSituation ?? "",
        identity: narrative?.identity ?? "",
        outlook: narrative?.outlook ?? "",
      }
    })

  await writeFile(outputPath, `${JSON.stringify(unified, null, 2)}\n`, "utf-8")
  console.log(`Wrote ${unified.length} teams to ${outputPath}`)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
