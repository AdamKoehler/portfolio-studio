import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// here i delete portfolio, project, and then user documents
// I delete them in that order so that way userId isnt lost before deleting project and portfolio documents
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userID = searchParams.get("userId");

        if (!userID) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        /*
        deleteMany() is used because Prisma just skips deletion instead of throwing an error.
        so if a user deletes their account when no portfolio or projects exist, it will not throw an error
        */
        // Deletion of the portfolio document
        await prisma.portfolio.deleteMany({
            where: { ownerId: userID },
        });

        // Deletion of the project documents
        await prisma.project.deleteMany({
            where: { ownerId: userID },
        });

        // Deletion of user document
        await prisma.user.deleteMany({
            where: { id: userID },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
