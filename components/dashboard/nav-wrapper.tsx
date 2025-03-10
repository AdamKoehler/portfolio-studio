"use client"; // Ensure it's a client component

import { usePathname } from "next/navigation";
import NavBar from "@/components/dashboard/nav-bar";

export default function NavWrapper() {
  const pathname = usePathname();

  // Routes where NavBar should be hidden
  const hideNavBarOnRoutes = ["/", "/auth", "/auth/login", "/auth/register"];
  const hideNavBar = hideNavBarOnRoutes.includes(pathname);

  return !hideNavBar ? <NavBar /> : null;
}
