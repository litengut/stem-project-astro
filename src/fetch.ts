import Bun from "bun"

export type DriverStanding = {
  meeting_key: number
  session_key: number
  driver_number: number
  position_start: number
  position_current: number
  points_start: number
  points_current: number
}

export type DriverStandings = DriverStanding[]
export async function getDriverStandings() {
  //   const response = await fetch(
  //     "https://api.openf1.org/v1/championship_drivers?session_key=latest"
  //   )
  //   const data = await response.json()
  const data = await Bun.file("./public/driver_standings.json").json()
  return data as DriverStandings
}

export type TeamStanding = {
  meeting_key: number
  session_key: number
  team_name: string
  position_start: number
  position_current: number
  points_start: number
  points_current: number
}

export type TeamStandings = TeamStanding[]

export async function getTeamStandings() {
  //   const response = await fetch(
  //     "https://api.openf1.org/v1/championship_teams?session_key=latest"
  //   )
  //   const data = await response.json()
  const data = await Bun.file("./public/team_standings.json").json()
  return data as TeamStandings
}
