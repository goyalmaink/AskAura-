import express from "express";
import authroute from "./routes/authroutes.js";
import cors from "cors";
import chatgemini from "./api/chatgemini.js"
import cookieParser from "cookie-parser";
import chattitle from "./api/chattitle.js"

const app = express();
const port = 3000;

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroute);
app.use("/api/auth", chatgemini);
app.use("/api/auth", chattitle)

app.listen(port, () => {
    console.log(`Backend is running at port ${port}`);
});
