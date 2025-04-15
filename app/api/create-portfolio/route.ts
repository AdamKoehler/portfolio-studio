import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");
      const rawBody = await req.text();

      // Parse JSON
      const { theme } = JSON.parse(rawBody);
      if (!theme) {
        return NextResponse.json({ message: "Theme is required" }, { status: 400 });
      }
      // console.log("User ID:", userId);
      if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
      }
      // Fetch all projects tied to the user
      const projects = await prisma.project.findMany({
        where: { ownerId: userId },
      });
      if (!projects) {
        return NextResponse.json({ message: "Projects not found" }, { status: 404 });
      }
      console.log("Projects:", projects);
      // Upsert (update or create) the portfolio for the user
        try {
        await prisma.portfolio.upsert({
          where: { ownerId: userId },
          update: {
            theme, // Update the theme field
            projects: { set: projects.map((project) => ({ id: project.id })) },
          },
          create: {
            ownerId: userId,
            theme,
            projects: { connect: projects.map((project) => ({ id: project.id })) },
          },
          include: { projects: true },
        });
        } catch (error) {
        console.log("ERROR WITH UPSERT ATTEMPT:", error);
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json({ message: "Server Error Updating Portfolio" }, { status: 500 });
  }
}
