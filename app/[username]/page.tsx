import { PortfolioClient } from "@/app/[username]/portfolio-client";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio",
};
// here i fetch all data that is needed to be displayed based on the unique username and pass it to the client.
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  
  // Fetch portfolio data
  const portfolio = await prisma.portfolio.findFirst({
    where: { ownerUsername: username },
    include: { 
      projects: true,
      owner: {
        select: {
          image: true,
          name: true
        }
      }
    },
  });

  if (!portfolio) {
    return <div>Portfolio not found</div>;
  }

  return <PortfolioClient portfolio={portfolio} />;
}

