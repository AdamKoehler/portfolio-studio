"use client";

import dynamic from "next/dynamic";
import { Prisma } from "@prisma/client";

// Dynamically import theme components
const themes = {
  space: dynamic(() => import('@/app/themes/space'), { ssr: false }),
  ocean: dynamic(() => import('@/app/themes/ocean'), { ssr: false }),
  forest: dynamic(() => import('@/app/themes/forest'), { ssr: false }),
}

type PortfolioWithProjects = Prisma.PortfolioGetPayload<{
  include: {
    projects: true;
    owner: {
      select: {
        image: true;
      }
    }
  }
}>;

export function PortfolioClient({ portfolio }: { portfolio: PortfolioWithProjects }) {
  // Get the appropriate theme component
  const ThemeComponent = themes[portfolio.theme as keyof typeof themes];

  return (
    <div className="w-full h-screen">
      <ThemeComponent portfolio={portfolio}/>
    </div>
  );
} 