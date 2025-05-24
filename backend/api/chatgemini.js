import express from "express";
import prisma from "../lib/prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authorization } from "../middleware.js";

const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const router = express.Router();

router.post("/chat", authorization, async (req, res) => {
    const { message } = req.body;
    const userId = req.userid;

    const prompt = req.body.message;
    console.log("message  by the user is  : ", prompt);

    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message must be a non-empty string." });
    }
    // Text to text message from the user and the response from the gemini model
    try {
        const user = await prisma.user.findUnique({ where: { userid: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const result = await model.generateContent(prompt);
        const botresponse = result.response.text();

        const title_prompt = "Generate one  best title of  this message";
        const recentchattitlefortitle = await model.generateContent([title_prompt ,prompt]);
        console.log("Ttle genration by the model is : " , recentchattitlefortitle.response.text());

        const titles = recentchattitlefortitle.response.text();
        const newchats = await prisma.chat.create({
            data: {
                userId: user.userid,
                title :titles
            }
        })
       
        const newUsermessage = await prisma.history.create({
            data: {
                usermessage: message,
                role: "user",
                chatId: newchats.chatId,
            }
        });
        
        const newBotmessage = await prisma.history.create({
            data: {
                usermessage: botresponse,
                role: 'bot',
                chatId: newchats.chatId
            }

        })
        // console.log("message  by the user is  that going to database  : ", newUsermessage, newBotmessage, );
        res.status(200).json({
            response: botresponse,
            message: "Message saved successfully"
        });
    }
    catch (error) {
        console.log("Error occured from chat controller", error);
        res.status(500).json({ message: "An error occured" })
    }
})

export default router;
