"use client"

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { DriversMenu } from "@/components/navigation/DriversMenu"
import { NavSimpleLink } from "@/components/navigation/NavSimpleLink"
import { TeamsMenu } from "@/components/navigation/TeamsMenu"
import { driverLinks, teamLinks } from "@/components/navigation/nav-data"

export function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavSimpleLink label="Home" href="/" />
        <TeamsMenu teamLinks={teamLinks} />
        <DriversMenu driverLinks={driverLinks} />
        <NavSimpleLink label="Team Standings" href="/team-standings" />
        <NavSimpleLink label="Driver Standings" href="/driver-standings" />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
