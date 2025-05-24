import jwt from "jsonwebtoken";
 
export const authorization = async (req, res, next) => {   
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "You are not authorised" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userid  = decoded.userid ;
        next();
    } catch (error) {
        console.log("Jwt verification failed " , error);
        res.status(500).json({ message: "Unauthorized: Invalid or expired token." });
    }
};