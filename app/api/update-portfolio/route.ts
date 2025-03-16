import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest) {
    try {
      const userId = req.nextUrl.searchParams.get("userId") as string;
      const {  aboutMe, github, linkedin, projects } = await req.json();
  
      const updatedPortfolio = await prisma.portfolio.update({
        where: { ownerId: userId },
        data: {
          aboutMe,
          github,
          linkedin,
          projects: {
            updateMany: projects.map((project: { id: string; title: string; description: string }) => ({
              where: { id: project.id },
              data: { title: project.title, description: project.description },
            })),
          },
        },
        include: { projects: true },
      });
  
      return NextResponse.json({ success: true, portfolio: updatedPortfolio });
    } catch (error) {
      console.error("Error updating portfolio:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  