"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const fromUser = session?.user.id;
    if(!fromUser) {
        return {
            messaging: "Error while sending the money"
        }
    }
    const  toUser = await prisma.user.findFirst({
        where: {
            PhoneNumber: to
        }
    })

    if(!toUser) {
        return {
            message: "user not found"
        }
    }

    await prisma.$transaction(async (tx) => {
        const fromBalance = await tx.balance.findUnique({
            where: {userId: Number(fromUser)}
        })
        // make this more securely so that no bypassing should happen over there in the future.
        if (!fromBalance || fromBalance.amount < amount){
            throw new Error("Insufficient Error")
        }

        await tx.balance.update({
            where: {userId: Number(fromUser)},
            data: {amount: {decrement: amount}}
        })

        await tx.balance.update({
            where: {userId: toUser.id},
            data: {amount: {increment: amount}}
        })
    })
}