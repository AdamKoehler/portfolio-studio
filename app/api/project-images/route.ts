// app/api/project-images/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, projectId, imageUrl } = await req.json();

    if (!userId || !projectId || !imageUrl) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId, ownerId: userId },
    });

    if (!project || project.ownerId !== userId) {
      return new Response(JSON.stringify({ error: "Project not found or unauthorized" }), { status: 404 });
    }

    // Change or populate for the first time the URL string in the database
    const updatedProject = await prisma.project.update({
      where: { id: projectId, ownerId: userId },
      data: { imageURL: imageUrl },
    });

    return new Response(JSON.stringify({ message: "Image updated successfully", project: updatedProject }), { status: 200 });
  } catch (error) {
    console.error("Error updating project image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
