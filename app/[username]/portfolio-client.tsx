"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectType } from "../dashboard/update/page";

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

  // Temporary basic render until 3JS implementation
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">{username}&apos;s Portfolio</h1>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">About Me</h2>
            <p>{portfolioData.aboutMe}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Links</h2>
            <div className="flex gap-4">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                GitHub
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    {project.imageURL && (
                      <img 
                        src={project.imageURL} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="mb-2">{project.description}</p>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Project
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 