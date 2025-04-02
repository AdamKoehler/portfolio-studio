import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// deletion of database project documents used on update tab
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userID = searchParams.get("userId");
        const projectID = searchParams.get("projectId");

        if (!userID && !projectID) {
            return NextResponse.json({ error: "User ID and project ID is required" }, { status: 400 });
        }
        // Deletion of the project documents
        await prisma.project.delete({
            where: { ownerId: userID!,
                     id: projectID! }
        }); // ! says trust me, this exists.

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
