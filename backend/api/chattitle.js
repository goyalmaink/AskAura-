import express from "express";
import prisma from "../lib/prisma.js";
import { authorization } from "../middleware.js";

const router = express.Router();
const generateRecentsChat = async (userid) => {
    try {

        const recentsChats = await prisma.chat.findMany({
            where: { userId: userid },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                chatId: true,
                title: true
            }
        });

        if (!recentsChats || recentsChats.length === 0) {
            console.log("No recent chats found for user:", userid);
            return [];
        }

        const anwer = recentsChats.map(userChat => {
            return {
                chatId: userChat.chatId || "Unknown Chat",
                title: userChat.title || "Untitled Chat"
            };
        });

        // console.log("Answer is : ", anwer)
        return anwer;
    } catch (error) {
        console.log("Error in generateRecentsChat function:", error);
        throw new Error("Error generating recent chats");
    }
};


router.get("/recent", authorization, async (req, res) => {
    const userid = req.userid;
    if (!userid) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const recentChatsWithTitle = await generateRecentsChat(userid);
        res.json({ data: recentChatsWithTitle });
    } catch (error) {
        console.log("Error occurred in the /recent route:", error);
        res.status(500).json({ message: "An error occurred while fetching recent chats." });
    }
});


router.get("/recent/:chatid", authorization, async (req, res) => {
    const { chatid } = req.params;
    const userid = req.userid;
    // console.log("chatid ids : ", chatid);
    // console.log("user id is : " , userid)

    try {
        const oldchats = await prisma.chat.findUnique({
            where:{chatId : chatid} , 
            include :{
                history:true 
            }
        })
        if(!oldchats)
        {
             return res.json(404).json({ message: "Chat not found" });
        }

        res.json({ data: oldchats });
    }
    catch (error) {
        console.log("Error occured from the chat id routes ", error);
        res.status(500).json({ message: "An error occurred while fetching the chat details." });
    }
});

export default router;
