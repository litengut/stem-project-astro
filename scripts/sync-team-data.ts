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

type SessionInfo = {
  session_key: number
  circuit_short_name: string
  date_start: string
  date_end: string
}

type SessionResult = {
  driver_number: number
  position: number | null
  dnf: boolean
  dns: boolean
  dsq: boolean
  points: number
}

type FormStatus =
  | "win"
  | "second"
  | "third"
  | "better"
  | "worse"
  | "dnf"
  | "dns"

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

const RACE_LOOKBACK = 5
const FALLBACK_TEAM_COLOR = "#9CA3AF"
const FALLBACK_TEAM_LOGO =
  "https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/logo/f1_logo_red.webp"

const buildTeamLogoUrl = (teamName: string) => {
  const teamSlug = teamName.toLowerCase().replace(/[^a-z0-9]+/g, "")
  return `https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/${teamSlug}/2026${teamSlug}logowhite.webp`
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

const titleCaseName = (name: string) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

async function getJson<T>(url: string): Promise<T> {
  const maxAttempts = 5

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(url)
    if (response.ok) {
      return (await response.json()) as T
    }

    if (response.status === 429 && attempt < maxAttempts) {
      const retryAfterHeader = response.headers.get("retry-after")
      const retryAfterSeconds = Number(retryAfterHeader)
      const waitMs = Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds * 1000
        : attempt * 1200

      await Bun.sleep(waitMs)
      continue
    }

    throw new Error(`Request failed (${response.status}) for ${url}`)
  }

  throw new Error(`Request failed (429) for ${url}`)
}

function average(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function appendStatus<T extends string | number>(
  map: Map<T, FormStatus[]>,
  key: T,
  status: FormStatus
) {
  const current = map.get(key) ?? []
  current.push(status)
  map.set(key, current)
}

function normalizeForm(statuses: FormStatus[] | undefined, raceCount: number) {
  if (!statuses || statuses.length === 0) {
    return Array.from({ length: raceCount }, () => "dns" as const)
  }
  if (statuses.length >= raceCount) return statuses
  return [
    ...Array.from(
      { length: raceCount - statuses.length },
      () => "dns" as const
    ),
    ...statuses,
  ]
}

function getShortName(teamName: string) {
  return teamName
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()
}

function getDriverStatus(
  result: SessionResult,
  averagePosition: number | null
): FormStatus {
  if (result.dns) return "dns"
  if (result.dnf || result.dsq || result.position === null) return "dnf"
  if (result.position === 1) return "win"
  if (result.position === 2) return "second"
  if (result.position === 3) return "third"
  if (averagePosition === null) return "worse"
  return result.position <= averagePosition ? "better" : "worse"
}

async function getRaceSessions() {
  const year = new Date().getFullYear()
  const sessions = await getJson<SessionInfo[]>(
    `https://api.openf1.org/v1/sessions?year=${year}&session_name=Race`
  )
  const now = Date.now()

  return sessions
    .filter((session) => new Date(session.date_end).getTime() <= now)
    .sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    )
}

async function run() {
  const root = process.cwd()
  const narrativesPath = path.join(root, "public", "f1", "teams-content.json")
  const driversContentPath = path.join(
    root,
    "public",
    "f1",
    "drivers-content.json"
  )
  const outputPath = path.join(root, "public", "f1", "teams-unified.json")
  const tableOutputPath = path.join(
    root,
    "public",
    "f1",
    "standings-table-data.json"
  )

  const [standings, drivers, narrativeRaw, driversContentRaw, sessions] =
    await Promise.all([
      getJson<TeamStanding[]>(
        "https://api.openf1.org/v1/championship_teams?session_key=latest"
      ),
      getJson<DriverApi[]>(
        "https://api.openf1.org/v1/drivers?session_key=latest"
      ),
      readFile(narrativesPath, "utf-8"),
      readFile(driversContentPath, "utf-8"),
      getRaceSessions(),
    ])

  const recentSessions = sessions.slice(-RACE_LOOKBACK)

  const narratives = JSON.parse(narrativeRaw) as TeamNarrative[]
  const driversContent = JSON.parse(driversContentRaw) as Array<{
    name: string
    team: string
    driverNumber: number
    position: number
    points: number
  }>

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
        teamLogo: buildTeamLogoUrl(standing.team_name),
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

  const seasonResults: SessionResult[][] = []
  for (const session of sessions) {
    const results = await getJson<SessionResult[]>(
      `https://api.openf1.org/v1/session_result?session_key=${session.session_key}`
    )
    seasonResults.push(results)
  }

  const recentSessionKeys = new Set(
    recentSessions.map((session) => session.session_key)
  )
  const recentResults = seasonResults.filter((_, index) =>
    recentSessionKeys.has(sessions[index].session_key)
  )

  const driverFormByNumber = new Map<number, FormStatus[]>()
  const teamFormByName = new Map<string, FormStatus[]>()
  const teamByDriver = new Map(
    drivers.map((driver) => [driver.driver_number, driver.team_name])
  )

  for (const sessionResults of recentResults) {
    const classifiedPositions = sessionResults
      .map((result) => result.position)
      .filter((position): position is number => typeof position === "number")
    const averageDriverPosition = average(classifiedPositions)

    for (const result of sessionResults) {
      const status = getDriverStatus(result, averageDriverPosition)
      appendStatus(driverFormByNumber, result.driver_number, status)
    }

    const teamMetrics = new Map<
      string,
      {
        positions: number[]
        dnsCount: number
        dnfCount: number
        points: number
      }
    >()

    for (const result of sessionResults) {
      const teamName = teamByDriver.get(result.driver_number)
      if (!teamName) continue

      const metric = teamMetrics.get(teamName) ?? {
        positions: [],
        dnsCount: 0,
        dnfCount: 0,
        points: 0,
      }

      if (result.dns) {
        metric.dnsCount += 1
      } else if (result.dnf || result.dsq || result.position === null) {
        metric.dnfCount += 1
      } else {
        metric.positions.push(result.position)
      }

      metric.points += result.points
      teamMetrics.set(teamName, metric)
    }

    const teamSessionAverages = Array.from(teamMetrics.values())
      .map((metric) => average(metric.positions))
      .filter((value): value is number => typeof value === "number")
    const averageTeamPosition = average(teamSessionAverages)

    const rankedTeams = Array.from(teamMetrics.entries())
      .filter(([, metric]) => metric.positions.length > 0)
      .map(([teamName, metric]) => ({
        teamName,
        points: metric.points,
        averagePosition: average(metric.positions) ?? Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        return a.averagePosition - b.averagePosition
      })

    const rankByTeam = new Map(
      rankedTeams.map((team, index) => [team.teamName, index + 1])
    )

    for (const [teamName, metric] of teamMetrics.entries()) {
      if (metric.positions.length === 0) {
        const fallbackStatus: FormStatus =
          metric.dnsCount > 0 && metric.dnfCount === 0 ? "dns" : "dnf"
        appendStatus(teamFormByName, teamName, fallbackStatus)
        continue
      }

      const teamRank = rankByTeam.get(teamName)
      if (teamRank === 1) {
        appendStatus(teamFormByName, teamName, "win")
        continue
      }
      if (teamRank === 2) {
        appendStatus(teamFormByName, teamName, "second")
        continue
      }
      if (teamRank === 3) {
        appendStatus(teamFormByName, teamName, "third")
        continue
      }

      const teamAveragePosition = average(metric.positions)
      const status: FormStatus =
        averageTeamPosition !== null &&
        teamAveragePosition !== null &&
        teamAveragePosition <= averageTeamPosition
          ? "better"
          : "worse"

      appendStatus(teamFormByName, teamName, status)
    }
  }

  const raceLabels = recentSessions.map((session) => session.circuit_short_name)

  const teamSeasonStatsByName = new Map<
    string,
    { wins: number; podiums: number }
  >()
  for (const sessionResults of seasonResults) {
    for (const result of sessionResults) {
      const teamName = teamByDriver.get(result.driver_number)
      if (!teamName || typeof result.position !== "number") continue

      const current = teamSeasonStatsByName.get(teamName) ?? {
        wins: 0,
        podiums: 0,
      }

      if (result.position === 1) current.wins += 1
      if (result.position <= 3) current.podiums += 1

      teamSeasonStatsByName.set(teamName, current)
    }
  }

  const unifiedByName = new Map(unified.map((team) => [team.name, team]))

  const driversTable = driversContent
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((driver) => {
      const matchingTeam = unifiedByName.get(driver.team)

      return {
        position: driver.position,
        driver: driver.name,
        team: driver.team,
        teamColor: matchingTeam?.teamColor ?? FALLBACK_TEAM_COLOR,
        teamLogo: matchingTeam?.teamLogo ?? buildTeamLogoUrl(driver.team),
        shortName: matchingTeam
          ? getShortName(matchingTeam.name)
          : getShortName(driver.team),
        number: driver.driverNumber,
        points: driver.points,
        form: normalizeForm(
          driverFormByNumber.get(driver.driverNumber),
          raceLabels.length
        ),
      }
    })

  const teamsTable = unified
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((team) => {
      const seasonStats = teamSeasonStatsByName.get(team.name)

      return {
        position: team.position,
        points: team.points,
        wins: seasonStats?.wins ?? 0,
        podiums: seasonStats?.podiums ?? 0,
        team: team.name,
        teamColor: team.teamColor ?? FALLBACK_TEAM_COLOR,
        teamLogo:
          team.teamLogo ?? buildTeamLogoUrl(team.name) ?? FALLBACK_TEAM_LOGO,
        shortName: getShortName(team.name),
        form: normalizeForm(teamFormByName.get(team.name), raceLabels.length),
      }
    })

  const tableData = {
    raceLabels,
    updatedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    drivers: driversTable,
    teams: teamsTable,
  }

  await writeFile(
    tableOutputPath,
    `${JSON.stringify(tableData, null, 2)}\n`,
    "utf-8"
  )
  console.log(`Wrote standings table data to ${tableOutputPath}`)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
