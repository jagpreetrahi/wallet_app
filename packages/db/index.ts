import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// create a sage global storage
const globalThisForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalThisForPrisma.prisma ?? prismaClient

if(process.env.NODE_ENV !== "production"){
    globalThisForPrisma.prisma = prisma
}