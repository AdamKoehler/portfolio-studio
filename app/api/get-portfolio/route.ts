import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userID = req.nextUrl.searchParams.get("userId"); // query parameter on client side provieds us with user id

    if (!userID) {
      return NextResponse.json({ message: "User ID is required" , portfolio: null}, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { ownerId: userID },
      include: { projects: true },
    });

    if (!portfolio) {
      return NextResponse.json({ message: "Portfolio not found", portfolio: null }, { status: 404 });
    }

    return NextResponse.json({success: true, portfolio}, {status: 200});
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ message: "Internal Server Error", portfolio: null }, { status: 500 });
  }
}
