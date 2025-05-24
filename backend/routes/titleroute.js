import express from 'express';
const router = express.Router();

import chattitle  from "../api/chattitle.js"

router.get("/recent", chattitle)
router.get("/recent/:chatid"  ,chattitle)
export default router;
