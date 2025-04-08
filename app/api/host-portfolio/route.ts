import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const {userId, username} = await req.json();

  if (!userId || !username) {
    return NextResponse.json({ message: "User ID and username is required" }, { status: 400 });
  }

  try {
    // Check if username is already taken
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { ownerUsername: username },
    });

    if (existingPortfolio) {
      return NextResponse.json({ message: "Username is already taken" }, { status: 409 });
    }

    // Ensure portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { ownerId: userId },
    });

    if (!portfolio) {
      return NextResponse.json({ message: "No portfolio found" }, { status: 404 });
    }

    // Update portfolio with username for hosting
    await prisma.portfolio.update({
      where: { ownerId: userId },
      data: { ownerUsername: username } as Prisma.PortfolioUpdateInput
    });

    return NextResponse.json({ success: true, message: "Portfolio hosted successfully!", username: username });
  } catch (error) {
    console.error("Hosting error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
