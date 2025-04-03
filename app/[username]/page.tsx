// This is a Server Component
import { PortfolioClient } from "@/app/[username]/portfolio-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PortfolioClient username={username} />;
}

