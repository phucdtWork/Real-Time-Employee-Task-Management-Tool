import dotenv from "dotenv";
import { verifyToken } from "../utils/jwtConfig.js";
dotenv.config();

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        const authorization = req?.headers["authorization"];
        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authorization.split(" ")[1];
        try {
            const decoded = verifyToken(token);
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Token is invalid" });
        }
    };
};

const messageMiddleware = authorize(["employee", "owner", "staff"]);
const ownerMiddleware = authorize(["owner"]);
const employeeMiddleware = authorize(["employee"]);

export { messageMiddleware, ownerMiddleware, employeeMiddleware };
