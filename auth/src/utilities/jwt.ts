import jwt from "jsonwebtoken";
import { BadRequestError, EUserRole } from "@kneonix-ticketing/common";

export const createJWT = (id: string, email: string, role: EUserRole) => {
    if (!process.env.JWT_KEY) {
        throw new BadRequestError("JWT_KEY must be defined");
    }
    return jwt.sign({ id, email, role }, process.env.JWT_KEY!, {
        expiresIn: "15m",
    });
};

export const verifyJWT = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY!);
    } catch (error) {
        return null;
    }
};
