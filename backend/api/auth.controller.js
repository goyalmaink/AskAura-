import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        console.log("User hashed password is  : ", hashedpassword);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedpassword
            }
        })
        console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user!" });
    }
};

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const totalage = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            {
                userid: user.userid,
                isAdmin: false,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: totalage }
        );
        console.log("token is  : ", token);
         
        const { password: userPassword, ...userInfo } = user;
         
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: totalage,
        }).status(200).json(userInfo);
        console.log("Successfully logged in ") ;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login!" });

    }

};








