"use server"
import { database } from "@/lib/database"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"
export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)
    
    if (!existingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date() > existingToken.expires; // if time now is greater than token creation time + 30 mins
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "User not found" };
    }
    // from here we can update our database and users verification status
    await database.user.update({
        where: {
            id: existingUser
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email 
        }
    })
    // then delete token from database
    await database.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Verification successful" };
}