"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function NavBar() {
  const pathname = usePathname();

  const getActiveClass = (href: string) => 
    pathname === href 
      ? "bg-primary text-white rounded-md" 
      : "hover:bg-accent hover:text-accent-foreground rounded-md transition duration-200";

  return (
    <NavigationMenu className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-background px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-16">
      <NavigationMenuList className="flex gap-16">
        <NavigationMenuItem>
          <Link href="/dashboard/create" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getActiveClass("/dashboard/create")}`}>
              Create
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/update" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getActiveClass("/dashboard/update")}`}>
              Update
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/delete" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getActiveClass("/dashboard/delete")}`}>
              Delete
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/delete" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getActiveClass("/dashboard/host")}`}>
              Host
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}