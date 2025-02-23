// upon logging in our form is sent here.
// in this backend ts file we will perform some validation to make sure that our user can login
"use server"
import z from "zod";
import { database } from "@/lib/database";
import { compare } from 'bcryptjs';
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/token";
import { LoginFormSchema } from "@/schema";

export const login = async (data: z.infer<typeof LoginFormSchema>) => {
    // we recieve form data from UI
    try {
        const validatedData = LoginFormSchema.parse(data);

        if (!validatedData) {
            return { error:"Invalid data"};
        }

        //  Destructure the validated data
        const {
            email: email,
            password: password,
        } = validatedData;

        // here we compare provided credentials with credentials in the database
        // if we find a match we return a success message and a verification token is generated.
        const user = await database.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return {error: "User not found"};
        }

        if (user.password === password) {
        const verificationToken = await generateVerificationToken(user.email);
        // send verification email
        await sendVerificationEmail(user.email, verificationToken.token);
        return ({
            success: true
        })
        }

        else {   
            return {error: "Incorrect password"};
        }
    } catch (error) {
        console.log(error);
        return {error: "Could not login see console log for error"} 
    } 
}