"use client"
import Link from "next/link"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function NavBar() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const currentPath = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  
  // Listen for session updates
  useEffect(() => {
    setAvatarKey(prev => prev + 1);
  }, [session?.user?.image]);
  
  if (status === "loading" || !session?.user?.id) {
    return <div>Loading...</div>;
  }
  
  const userId = session.user.id;
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/create', label: 'Create' },
    { path: '/dashboard/update', label: 'Update' },
    { path: '/dashboard/delete', label: 'Delete' },
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full py-4">
      {/* Mobile version */}
      <div className="md:hidden px-4 flex items-center justify-between">
        <button 
          className="p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden">
                <Avatar key={avatarKey}>
                  <AvatarImage src={session?.user.image || defaultProfileImage.src} />
                  <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  View Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>  
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: process.env.NEXTAUTH_URL })} className="text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Desktop version */}
      <div className="hidden md:block">
        <div className="max-w-4xl mx-auto px-4">
          <NavigationMenu className="flex justify-between items-center w-full">
            <div className="w-40"></div>
  
            <NavigationMenuList className="flex gap-16 lg:gap-24 mr-16">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link 
                    href={`${item.path}?`} 
                    className={`text-lg ${currentPath === item.path ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            
            {/* Right side - profile */}
            <div className="flex items-center gap-3 w-40 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden">
                    <Avatar key={avatarKey}>
                      <AvatarImage src={session?.user.image || defaultProfileImage.src} />
                      <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                      View Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>  
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })} className="text-red-600">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span>{session?.user?.name}</span>
            </div>
          </NavigationMenu>
        </div>
      </div>
      
      {/* Mobile Navigation Menu (overlay) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={`${item.path}?`}
                className={`p-2 ${currentPath === item.path ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}