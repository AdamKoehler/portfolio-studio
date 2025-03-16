"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/dashboard/nav-bar";

export default function NavWrapper() {
  const pathname = usePathname();

  // Routes where NavBar should be Shown
  const showNavBarOnRoutes = ["/dashboard", "/dashboard/create", "/dashboard/update", "/dashboard/delete"];
  const showNavBar = showNavBarOnRoutes.includes(pathname);

  return showNavBar ? <NavBar /> : null;
}
