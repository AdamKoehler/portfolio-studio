import { database } from "@/lib/database";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const token = await database.verificationToken.findFirst({
            where: {
                email: email
            }
        });
        return token;
    } catch (error) {
        console.log(error);
    } 
}