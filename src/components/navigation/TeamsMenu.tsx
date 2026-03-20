import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { TeamLink } from "./nav-data"

type Props = {
  teamLinks: TeamLink[]
}

export function TeamsMenu({ teamLinks }: Props) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="rounded-md px-3">
        Teams
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[92vw] grid-cols-4 gap-2 p-2">
          {teamLinks.map((team) => (
            <li key={team.href}>
              <NavigationMenuLink
                render={
                  <a
                    className="group relative block h-33 overflow-hidden rounded-md border border-border/60 bg-card p-2 transition-colors hover:bg-muted"
                    href={team.href}
                  >
                    <div className="absolute inset-2 overflow-hidden rounded-sm bg-gradient-to-r from-[#0f1014] to-[#202736]">
                      <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-[140%] overflow-hidden text-center text-4xl font-black tracking-tight text-nowrap text-white/12 uppercase">
                        {team.title}
                      </p>
                      <div className="absolute inset-x-0 bottom-3 h-5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <img
                        src={team.carImage}
                        alt={`${team.title} car`}
                        className="absolute bottom-1 left-1/2 h-[86px] w-[270px] -translate-x-1/2 object-contain object-center transition-transform duration-300 group-hover:translate-x-[-48%]"
                        loading="lazy"
                      />
                    </div>
                  </a>
                }
              />
            </li>
          ))}
          <li className="col-span-4">
            <NavigationMenuLink
              render={
                <a
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                  href="/"
                >
                  View full standings
                </a>
              }
            />
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
