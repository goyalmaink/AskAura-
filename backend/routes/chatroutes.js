import express from 'express';
const router = express.Router();
import chatgemini from "../api/chatgemini.js";

router.post("/chat", chatgemini);


export default router;
