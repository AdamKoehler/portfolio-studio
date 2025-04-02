// app/api/project-images/route.ts
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, imageUrl } = await req.json();

    if (!userId || !imageUrl) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const User = await prisma.user.findUnique({
      where: { id: userId },
    });

    if ( !User || !User.id || User.id !== userId) {
      return new Response(JSON.stringify({ error: "User not found or unauthorized" }), { status: 404 });
    }

    // Change or populate for the first time the user profile image in the database
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    

    return new Response(JSON.stringify({ message: "Image updated successfully"}), { status: 200 });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
