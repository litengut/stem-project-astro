"use client"

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { DriversMenu } from "@/components/navigation/DriversMenu"
import { NavSimpleLink } from "@/components/navigation/NavSimpleLink"
import { TeamsMenu } from "@/components/navigation/TeamsMenu"
import { driverLinks, teamLinks } from "@/components/navigation/nav-data"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavSimpleLink label="Home" href="/" />
        <TeamsMenu teamLinks={teamLinks} />
        <DriversMenu driverLinks={driverLinks} />
        <NavSimpleLink label="Standings" href="/" />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
