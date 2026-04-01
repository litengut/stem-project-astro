import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { DriverLink } from "./nav-data"

type Props = {
  driverLinks: DriverLink[]
}

export function DriversMenu({ driverLinks }: Props) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="rounded-md px-3">
        Drivers
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid grid-cols-4 gap-1 p-2">
          {driverLinks.map((driver) => (
            <li key={driver.href}>
              <NavigationMenuLink
                render={
                  <a
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    href={driver.href}
                  >
                    <img
                      src={driver.image}
                      alt={driver.title}
                      className="h-10 w-10 rounded-full object-cover object-top"
                      loading="lazy"
                    />
                    <span>{driver.title}</span>
                  </a>
                }
              />
            </li>
          ))}
          {/* <li>
            <NavigationMenuLink
              render={
                <a
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                  href="/"
                >
                  View driver standings
                </a>
              }
            />
          </li> */}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
