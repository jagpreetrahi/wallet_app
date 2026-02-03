"use server";
import { prisma } from "@repo/db/client";
import {getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    // ideally the  token should come from the banking provider 
    const session = await getServerSession(authOptions);
    if(!session?.user || !session?.user.id) {
       return  {
          message: "Unauthorized request"
       }
    }
    // i need to get a token from the webhook which gets from the provider
    const token = (Math.random() * 100).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date().getTime().toString(),
            token: token,
            userId: Number(session.user.id),
            amount: amount * 100
        }
    });

    return {
        message: "Done"
    }
}