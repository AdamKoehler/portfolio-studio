import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { getUserByEmail } from "@/data/user";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    //console.log("POST request received");

    try {
        const session = await getServerSession(authOptions) as { user: { email: string } };
        if (!session || !session.user.email) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const userID = await getUserByEmail(session.user.email);
        if (!userID) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { project } = await req.json();
        console.log("Received project:", project);

        if (!project) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const { Title, Description, URL } = project;

        if (!Title || !Description || !URL) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const createdProject = await prisma.project.create({
            data: {
                title: Title,
                description: Description,
                url: URL,
                owner: { connect: { id: userID } },
            }
        });

        return NextResponse.json({ message: "Project created successfully", project: createdProject }, { status: 201 });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
