import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      // Credentials provider for email/password authentication
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) { // Rejects empty email or password
          if (!credentials?.email || !credentials?.password) {
            console.log("Authorize failed");
            return null;
          }
  
        // Search db using provided email
        // Connect to MongoDB via Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("User not found in database");
          throw new Error("User not found");
        }
        // Compare passwords
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          console.log("Provided password does not match DB password");
          throw new Error("Invalid password");
        }

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
      {/*
      user: user info like name, email, etc. (user is a standard property that NextAuth provides)
      account: if using OAuth, this contains the authentication details from the provider (or empty for credentials).
        */}

      if (account?.provider === "credentials") {
      return true;  
      }
      // here we see if OAUTh provided email exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      if (!existingUser) {
        // If the user doesn't exist, try to create them in the database
        try {
          await prisma.user.create({
            data: {
              name: user.name as string,
              email: user.email as string,
              password: `${"OAUTH:"+ Math.random().toString(36).slice(2, 15)}`, // oauth users get a random password to fullfill password requirements
              emailVerified: new Date(),
              image: user.image as string,
              provider: account?.provider as string,
            },
          });
        } catch (error) {
        console.error("Error creating user in database:", error);
        return false;
        }
      } else { // if the user does exist in the database then this will ensure the user id is populated
      user.id = existingUser.id;
      }
      return true;
      },
      async jwt({ token, user }) {
        if (user) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email as string } });
          if (dbUser) {
            token.id = dbUser.id; // Ensure correct ID is stored in the token
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.image;
            token.provider = dbUser.provider;
            token.emailVerified = dbUser.emailVerified;
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string; // Attach the user info to the session
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.image = token.image as string;
        }
        //console.log("Session after callback:", session);
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
  });
  
  export { authOptions as GET, authOptions as POST };