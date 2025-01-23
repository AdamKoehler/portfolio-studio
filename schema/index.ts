import * as z from "zod";
export const RegisterFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    firstName : z.string().min(1, {
        message: "Please enter your first name"
    }),
    lastName : z.string().min(1, {
        message: "Please enter your last name"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }),
    confirmPassword: z.string().min(6, {
        message: "Passwords must match"
    }),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"], // confirmPassword will present an error if password doesn't match
      });