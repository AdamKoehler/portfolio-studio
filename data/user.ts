"use server";
import { database } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await database.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })
        return user ? user.id : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await database.user.findUnique({
            where: {
                id: id
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const GetUserID = async () => {
    try {
        const session = await getServerSession(authOptions) as { user: { email: string } };
        const userID = await getUserByEmail(session.user.email);
        //console.log("User ID:", userID);
        return userID;
    } catch (error) {
        console.log("Error fetching session:", error);
        return null;
    }
}

export const getUserByUsername = async (providedUsername: string): Promise<string | null> => {
    // first we look for the portfolio by username
    const portfolio = database.portfolio.findUnique({ where: { ownerUsername: providedUsername } });
    // then we return the owner id
    return portfolio.then((portfolio) => portfolio?.ownerId ?? null);
}