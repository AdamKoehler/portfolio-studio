// upon register form submission our form is sent here.
// in this backend ts file we will perform some validation to make sure that our user can register
"use server"
import z from "zod";
import { RegisterFormSchema } from "@/schema";
import { database } from "@/lib/database";
import { hash } from 'bcryptjs';
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/token";

export const register = async (data: z.infer<typeof RegisterFormSchema>) => {
    try {
        const validatedData = RegisterFormSchema.parse(data);

        if (!validatedData) {
            return { error:"Invalid data"};
        }

        //  Destructure the validated data
        const {
            email: email,
            name: name,
            password: password,
            confirmPassword: passwordConfirmation } = validatedData;

        if (password !== passwordConfirmation) {
            return {error: "Passwords do not match"}
        }
        // user passwords will be stored as an encrypted string in the database.
        // for secure password storage i use npm i bcryptjs to install bcryptjs which proved a simple hash method
        // npm i --save-dev @types/bcryptjs
        //https://www.npmjs.com/package/bcryptjs
        const hashedPassword = await hash(password, 10); //hash(string, salt) where salt determines the complexity of the hash

        // before creating user we must see if user already exists
        const existingUser = await database.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return { error: "Email already is in use. Please try another one." };
          }


        // with no errors occuring we can create the user
        const user = await database.user.create({
            data: {
                email: email.toLowerCase(),
                name: name,
                password: hashedPassword
            }
        });

        // user gets a token created to verify email address
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);
        return {success: "Check your email to verify your account."};
        } catch (error) {
        console.log(error);
        return {error: "Something went wrong check console log for more details"}
    }
};