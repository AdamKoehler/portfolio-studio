"use client";

import { useEffect, useState } from "react";
import { ProjectType } from "../dashboard/update/page";
import dynamic from "next/dynamic";

// Dynamically import theme components
const themes = {
  space: dynamic(() => import('@/app/themes/space'), { ssr: false }),
  ocean: dynamic(() => import('@/app/themes/ocean'), { ssr: false }),
  forest: dynamic(() => import('@/app/themes/forest'), { ssr: false }),
}

type PortfolioData = {
  aboutMe: string;
  github: string;
  linkedin: string;
  projects: ProjectType[];
  theme: "space" | "ocean" | "forest";
  username: string;
};

export function PortfolioClient({ username }: { username: string }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioByUsername() {
      try {
        const response = await fetch(`/api/get-portfolio-by-username?username=${username}`);
        const data = await response.json();

        if (!data.success) {
          setError("Portfolio not found");
          return;
        }

        setPortfolioData(data.portfolio);
      } catch (err) {
        setError("Failed to fetch portfolio");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioByUsername();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !portfolioData) {
    return <div>Error: {error || "Portfolio not found"}</div>;
  }

  // Get the appropriate theme component
  const ThemeComponent = themes[portfolioData.theme];

  return (
    <div className="w-full h-screen">
      <ThemeComponent portfolio={portfolioData} />
    </div>
  );
} 