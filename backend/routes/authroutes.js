import express from 'express';
const router = express.Router();
import { signin, signup } from "../api/auth.controller.js";


router.post("/signup", signup);
router.post("/signin", signin);


export default router;