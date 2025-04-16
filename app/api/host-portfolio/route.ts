import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const {userId, username} = await req.json();

  if (!userId || !username) {
    return NextResponse.json({ message: "User ID and username is required" }, { status: 400 });
  }

  try {
    // Check if portfolio with this username already exists
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { ownerUsername: username },
    });

    if (existingPortfolio) {
      // If portfolio with this username exists but belongs to a different user
      if (existingPortfolio.ownerId !== userId) {
        return NextResponse.json({ message: "Username is already taken" }, { status: 409 });
      }
      
      // If portfolio with this username exists and belongs to the same user,
      // we can update it with the latest portfolio data
      await prisma.portfolio.update({
        where: { ownerId: userId },
        data: { ownerUsername: username } as Prisma.PortfolioUpdateInput
      });
      
      return NextResponse.json({ success: true, message: "Portfolio rehosted successfully!", username: username });
    } else {
      // If no portfolio with that username exists, update the current portfolio with the new username
      await prisma.portfolio.update({
        where: { ownerId: userId },
        data: { ownerUsername: username } as Prisma.PortfolioUpdateInput
      });

      return NextResponse.json({ success: true, message: "Portfolio hosted successfully!", username: username });
    }
  } catch (error) {
    console.error("Hosting error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
