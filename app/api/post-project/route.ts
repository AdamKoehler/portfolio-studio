import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserByEmail } from "@/data/user";
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as { user: { email: string } };  
        const userId = await getUserByEmail(session.user.email);

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
                owner: { connect: { id: userId as string } },
            }
        });

        return NextResponse.json({ message: "Project created successfully", project: createdProject }, { status: 200 });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
