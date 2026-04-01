export type TeamLink = {
  title: string
  href: string
  carImage: string
}

export type DriverLink = {
  title: string
  href: string
  image: string
}

import driverLinksJson from "./nav-driver-links.json"
import teamLinksJson from "./nav-team-links.json"
// @ai
export function makeLinkFromName(name: string, prefix = "") {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "")

  if (!normalizedPrefix) {
    return `/${slug}`
  }

  return `/${normalizedPrefix}/${slug}`
}

export const teamLinks = (teamLinksJson as TeamLink[]).map((team) => ({
  ...team,
  href: team.href || makeLinkFromName(team.title, "team"),
}))

export const driverLinks = (driverLinksJson as DriverLink[]).map((driver) => ({
  ...driver,
  href: driver.href || makeLinkFromName(driver.title, "driver"),
}))
