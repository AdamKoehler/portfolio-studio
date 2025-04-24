import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PortfolioWithViews = {
  id: string;
  ownerId: string;
  aboutMe: string | null;
  theme: string;
  github: string | null;
  linkedin: string | null;
  ownerUsername: string | null;
  viewCount: number;
  viewTimestamps: Date[];
};

export async function GET(req: NextRequest) {
  try {
    const userID = req.nextUrl.searchParams.get("userId");

    if (!userID) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { ownerId: userID }
    }) as unknown as PortfolioWithViews;

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const recentViews = portfolio.viewTimestamps
      .sort((a: Date, b: Date) => b.getTime() - a.getTime())
      .slice(0, 10);

    return NextResponse.json({
      viewCount: portfolio.viewCount,
      recentViews
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
} 