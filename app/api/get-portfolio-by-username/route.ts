import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerUsername: username },
      include: { projects: true },
    });

    if (!portfolio) {
      return NextResponse.json({ success: false, message: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolio by username:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
} 