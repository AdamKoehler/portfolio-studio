import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// here i delete portfolio, project, and then user documents
// I delete them in that order so that way userId isnt lost before deleting project and portfolio documents
export async function DELETE(req: NextRequest) {
    try {
        const userID = req.nextUrl.searchParams.get("userId") as string;
        if (!userID) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Deletion of the portfolio document
        await prisma.portfolio.delete({
            where: { ownerId: userID },
        });

        // Deletion of the project documents
        await prisma.project.deleteMany({
            where: { ownerId: userID },
        });

        // Deletion of user document
        await prisma.user.delete({
            where: { id: userID },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
