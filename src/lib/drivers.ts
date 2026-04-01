// chatgpt
import { readFile } from "node:fs/promises"
import path from "node:path"
import type { DriverStanding } from "@/fetch"
import type { Driver as OpenF1Driver } from "openf1-client/dist/types"

export type DriverSeasonStats = {
  seasonPosition: string
  seasonPoints: number
  grandPrixRaces: number
  grandPrixPoints: number
  grandPrixWins: number
  grandPrixPodiums: number
  grandPrixPoles: number
  grandPrixTop10s: number
  dhlFastestLaps: number
  dnfs: number
  sprintRaces: number
  sprintPoints: number
  sprintWins: number
  sprintPodiums: number
  sprintPoles: number
  sprintTop10s: number
}

export type DriverCareerStats = {
  grandPrixEntered: number
  careerPoints: number
  highestRaceFinish: string
  podiums: number
  highestGridPosition: string
  polePositions: number
  worldChampionships: number
  dnfs: number
}

type DriverStatsContent = {
  slug: string
  seasonStats2026: DriverSeasonStats
  careerStats: DriverCareerStats
}

export type DriverPageData = {
  slug: string
  firstName: string
  lastName: string
  fullName: string
  teamName: string
  teamColor: string
  driverNumber: number
  headshotUrl: string
  portraitUrl: string
  position: number
  points: number
  pointsGap: number
  seasonStats2026?: DriverSeasonStats
  careerStats?: DriverCareerStats
}

const teamAssetSlugByName: Record<string, string> = {
  Mercedes: "mercedes",
  Ferrari: "ferrari",
  "Red Bull Racing": "redbullracing",
  McLaren: "mclaren",
  "Haas F1 Team": "haasf1team",
  "Racing Bulls": "racingbulls",
  Alpine: "alpine",
  Audi: "audi",
  Williams: "williams",
  Cadillac: "cadillac",
  "Aston Martin": "astonmartin",
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-")
}

function getDriverCodeFromHeadshot(headshotUrl: string) {
  const match = headshotUrl.match(/\/([a-z0-9]+)\.png/i)
  return match?.[1]?.toLowerCase() ?? null
}

function getPortraitUrl(teamName: string, headshotUrl: string) {
  const teamSlug = teamAssetSlugByName[teamName]
  const driverCode = getDriverCodeFromHeadshot(headshotUrl)
  if (!teamSlug || !driverCode) return headshotUrl
  return `https://media.formula1.com/image/upload/c_lfill,w_1200/q_auto/v1740000001/common/f1/2026/${teamSlug}/${driverCode}/2026${teamSlug}${driverCode}right.webp`
}

export async function getDriverPageData(): Promise<DriverPageData[]> {
  const driverStandingsPath = path.join(
    process.cwd(),
    "public",
    "driver_standings.json"
  )
  const driversPath = path.join(process.cwd(), "public", "drivers.json")
  const driversStatsPath = path.join(
    process.cwd(),
    "public",
    "f1",
    "drivers-stats.json"
  )

  const driverStandings = JSON.parse(
    await readFile(driverStandingsPath, "utf-8")
  ) as DriverStanding[]
  const drivers = JSON.parse(
    await readFile(driversPath, "utf-8")
  ) as OpenF1Driver[]
  const driversStats = JSON.parse(
    await readFile(driversStatsPath, "utf-8")
  ) as DriverStatsContent[]

  const statsBySlug = new Map(driversStats.map((entry) => [entry.slug, entry]))

  const driverPages = driverStandings
    .map((standing) => {
      const driver = drivers.find(
        (item) => item.driver_number === standing.driver_number
      )
      if (!driver) return null

      const fullName = `${driver.first_name} ${driver.last_name}`
      const points = Number(standing.points_current)
      const slug = slugify(fullName)
      const extraStats = statsBySlug.get(slug)

      return {
        slug,
        firstName: driver.first_name,
        lastName: driver.last_name,
        fullName,
        teamName: driver.team_name,
        teamColor: `#${driver.team_colour}`,
        driverNumber: driver.driver_number,
        headshotUrl: driver.headshot_url,
        portraitUrl: getPortraitUrl(driver.team_name, driver.headshot_url),
        position: standing.position_current,
        points,
        ...(extraStats?.seasonStats2026
          ? { seasonStats2026: extraStats.seasonStats2026 }
          : {}),
        ...(extraStats?.careerStats
          ? { careerStats: extraStats.careerStats }
          : {}),
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => a.position - b.position)

  const leaderPoints = driverPages[0]?.points ?? 0

  return driverPages.map((driver) => ({
    ...driver,
    pointsGap: Math.max(0, leaderPoints - driver.points),
  }))
}

export async function getDriverStaticPaths() {
  const pagesWithGap = await getDriverPageData()
  return pagesWithGap.map((driver) => ({
    params: { name: driver.slug },
    props: { driver },
  }))
}
