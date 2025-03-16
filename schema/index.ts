import * as z from "zod";

export const RegisterFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    name : z.string().min(1, {
        message: "Please enter your first name"
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

export const LoginFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    })
});

export const usernameSchema = z.object({
    username: z.string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username cannot be longer than 20 characters" })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: "Username can only contain letters, numbers, dashes, and underscores",
      }),
  });
