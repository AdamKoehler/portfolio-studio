"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading state while fetching session
  }

  return <>{children}</>;
}