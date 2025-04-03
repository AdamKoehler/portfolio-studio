import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            console.log("Authorize failed");
            return null;
          }
  
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("User not found in database");
            throw new Error("User not found");
          }

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
        if (account?.provider === "credentials") {
          return true;  
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          try {
            await prisma.user.create({
              data: {
                name: user.name as string,
                email: user.email as string,
                password: `${"OAUTH:"+ Math.random().toString(36).slice(2, 15)}`,
                emailVerified: new Date(),
                image: user.image as string,
                provider: account?.provider as string,
              },
            });
          } catch (error) {
            console.error("Error creating user in database:", error);
            return false;
          }
        } else {
          user.id = existingUser.id;
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email as string } });
          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.image || undefined;
            token.provider = dbUser.provider || undefined;
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.image as string;
          session.user.provider = token.provider as string;
        }
        return session;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}; 