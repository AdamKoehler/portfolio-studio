// this ts file will allow us to use prisma in the backend.
// instead of using prisma directly in every file that needs data (several instances of prisma), I will import this file and use prisma for data needs.
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction#3-importing-prisma-client
import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const database = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production"){
    globalThis.prisma = database;
}