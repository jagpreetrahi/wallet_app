import express from "express"
import * as z from 'zod';
import {prisma} from "@repo/db/client"

const app = express();

app.use(express.json);
app.use(express.urlencoded({extended: true}))

app.post("/hdfcWebhook", async(req, res) => {
    const webhookData = z.object({
        token: z.string(),
        userId: z.number(),
        amount: z.number()
    })

    const paymentInformation  = webhookData.parse({
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    })

    try {
        await prisma.$transaction([
            prisma.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                     increment : Number(paymentInformation.amount)
                    }
                }   
            }),
            prisma.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data : {
                    status: "Success"
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (error) {
        console.error(error);
        return {
            statusCode: "411",
            message: "Error while processing webhook"
        }
    }
})

app.listen(3003, () => {
    console.log("Succesfully run the server")
})