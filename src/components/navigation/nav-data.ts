// @chatgpt
export type TeamLink = {
  title: string
  href: string
  carImage: string
}

export type DriverLink = {
  title: string
  href: string
}

export const teamLinks: TeamLink[] = [
  {
    title: "Alpine",
    href: "/team/alpine",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/alpine/2026alpinecarright.webp",
  },
  {
    title: "Aston Martin",
    href: "/team/aston-martin",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright.webp",
  },
  {
    title: "Audi",
    href: "/team/audi",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/audi/2026audicarright.webp",
  },
  {
    title: "Cadillac",
    href: "/team/cadillac",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaccarright.webp",
  },
  {
    title: "Ferrari",
    href: "/team/ferrari",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp",
  },
  {
    title: "Haas F1 Team",
    href: "/team/haas-f1-team",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamcarright.webp",
  },
  {
    title: "McLaren",
    href: "/team/mclaren",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp",
  },
  {
    title: "Mercedes",
    href: "/team/mercedes",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp",
  },
  {
    title: "Racing Bulls",
    href: "/team/racing-bulls",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright.webp",
  },
  {
    title: "Red Bull Racing",
    href: "/team/red-bull-racing",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp",
  },
  {
    title: "Williams",
    href: "/team/williams",
    carImage:
      "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/williams/2026williamscarright.webp",
  },
]

export const driverLinks: DriverLink[] = [
  { title: "Max Verstappen", href: "/driver/max-verstappen" },
  { title: "Lewis Hamilton", href: "/driver/lewis-hamilton" },
  { title: "Charles Leclerc", href: "/driver/charles-leclerc" },
  { title: "George Russell", href: "/driver/george-russell" },
]
