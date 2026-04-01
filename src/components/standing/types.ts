export type FormStatus =
  | "win"
  | "second"
  | "third"
  | "better"
  | "worse"
  | "dnf"
  | "dns"
  | "none"

export type DriverStandingRow = {
  position: number
  driver: string
  team: string
  teamColor: string
  shortName: string
  teamLogo: string
  number: number
  points: number
  form: FormStatus[]
  image: string
}

export type TeamStandingRow = {
  position: number
  points: number
  wins: number
  podiums: number
  team: string
  teamColor: string
  shortName: string
  teamLogo: string
  form: FormStatus[]
}

export type RaceFormData = {
  raceLabels: string[]
  driverFormByNumber: Map<number, FormStatus[]>
  teamFormByName: Map<string, FormStatus[]>
}

export type StandingsTableData = {
  raceLabels: string[]
  updatedAt: string
  drivers: DriverStandingRow[]
  teams: TeamStandingRow[]
}

export type StandingsPageData = {
  raceLabels: string[]
  updatedAt: string
  drivers: DriverStandingRow[]
  teams: TeamStandingRow[]
}
