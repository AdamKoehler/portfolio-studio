import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserByEmail } from "@/data/user";
import { revalidatePath } from 'next/cache';
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
    //console.log("Session:", session);
    const userID = await getUserByEmail(session.user.email);

    

    if (!userID) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Iterate through the array of repository IDs and fetch details
    const importedRepos = [];
    const failedRepos: { id: string; reason: string }[] = [];
    for (const repoID of repositories) {
      try {
        const repoDetails = await getRepoDetails(repoID, userID); // passing userID to the function
        importedRepos.push(repoDetails);
      } catch (error) {
        console.error(`Error importing repository ${repoID}:`, error);
        failedRepos.push({
          id: repoID,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Revalidate the create page to reflect the new imports
    revalidatePath('/dashboard/create');

    if (importedRepos.length === 0) {
      return NextResponse.json(
        { error: "Failed to import any repositories", failed: failedRepos },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, imported: importedRepos.length, failed: failedRepos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing repositories:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

async function getRepoDetails(id: string, userID: string) {
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

  return project; // Return the project for importing tracking
}