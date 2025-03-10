import { database } from "@/lib/database";

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