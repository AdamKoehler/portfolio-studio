"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import defaultProfileImage from '@/public/default-profile.jpg';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NavBar() {
  const session = useSession();
  return (
    <NavigationMenu className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-background px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-16">
      <NavigationMenuList className="flex gap-16">
        <NavigationMenuItem>
          <Link href={`/dashboard/create?`}>Create</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/dashboard/update?`}>Update</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/dashboard/delete?`}>Delete</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>

          <DropdownMenuTrigger>
            <div className="w-8 h-8">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.data?.user?.image || defaultProfileImage.src} />
                <AvatarFallback>{session.data?.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Change Image
              </DropdownMenuItem>
              </DropdownMenuGroup>
            <DropdownMenuGroup>  
              <DropdownMenuItem>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <span>{session?.data?.user?.name}</span>
      </div>
    </NavigationMenu>

  )
}