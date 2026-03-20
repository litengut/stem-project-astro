import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

type Props = {
  label: string
  href: string
}

export function NavSimpleLink({ label, href }: Props) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={
          <a
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            href={href}
          >
            {label}
          </a>
        }
      />
    </NavigationMenuItem>
  )
}
