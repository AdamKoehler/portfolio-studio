import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/data/user";
const key = process.env.GITHUB_API_KEY;

export async function POST(req: Request) {
  try {
    const { repositories } = await req.json();

    // Check if repositories are provided and are in array form
    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    //Get the current user session to access userID
    const session = await getServerSession(authOptions) as { user: { email: string } };
    console.log("Session:", session);
    const userID = await getUserByEmail(session.user.email);

    

    if (!userID) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Iterate through the array of repository IDs and fetch details
    const importedRepos = [];
    for (const repoID of repositories) {
      const repoDetails = await getRepoDetails(repoID, userID); // passing userID to the function
      if (repoDetails) {
        importedRepos.push(repoDetails);
      }
    }

    return NextResponse.json({ success: true, imported: importedRepos.length }, { status: 200 });
  } catch (error) {
    console.error("Error importing repositories:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

async function getRepoDetails(id: string, userID: string) {
  try {
    const response = await fetch(`https://api.github.com/repositories/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Create the project entry in the database
    const project = await database.project.create({
      data: {
        title: data.name,
        description: data.description || "",
        url: data.html_url,
        owner: {
          connect: { id: userID },
        },
      },
    });

    console.log("Project created successfully:", project);
    return project; // Return the project for importing tracking
  } catch (error) {
    console.error("Error fetching repository details:", error);
    return null; // Return null if there was an error
  }
}