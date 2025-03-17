"use client"

import Link from "next/link"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import defaultProfileImage from '@/public/default-profile.jpg';
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export default function NavBar() {
  const {data: session} = useSession();
  const currentPath = usePathname(); // gets the current route so that nav bar selected links can change color
  // this way users can see which page they are on
  
  return (
    <NavigationMenu className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-16 p-4">
      <NavigationMenuList className="flex gap-16">

      <NavigationMenuItem className={currentPath === '/dashboard' ? 'text-primary font-bold text-lg' : ''}>
          <Link href={`/dashboard?`} >Dashboard</Link>
        </NavigationMenuItem>
      
        <NavigationMenuItem className={currentPath === '/dashboard/create' ? 'text-primary font-bold text-lg' : ''}>
          <Link href={`/dashboard/create?`}>Create</Link>
        </NavigationMenuItem>
      
        <NavigationMenuItem className={currentPath === '/dashboard/update' ? 'text-primary font-bold text-lg' : ''}>
          <Link href={`/dashboard/update?` }>Update</Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem className={currentPath === '/dashboard/delete' ? 'text-primary font-bold text-lg' : ''}>
          <Link href={`/dashboard/delete?`}>Delete</Link>
        </NavigationMenuItem>
        
      </NavigationMenuList>
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-10 h-10 border-2 border-black">
              <Avatar>
                <AvatarImage  src={session?.user.image || defaultProfileImage.src} />
                <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
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
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <span>{session?.user?.name}</span>
      </div>
    </NavigationMenu>

  )
}