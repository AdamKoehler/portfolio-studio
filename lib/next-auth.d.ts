import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    isOAuth?: boolean;
    id: string;
  }

  interface Session {
    user: User;
  }
}
