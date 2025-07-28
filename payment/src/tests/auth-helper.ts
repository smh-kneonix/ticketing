import { EUserRole } from "@kneonix-ticketing/common";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = (userId?: string): string[] => {
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(), // Use a valid test user ID
        email: "test@example.com",
        role: EUserRole.ADMIN,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!, {
        expiresIn: "15m",
    });

    return [`jwt=${token}`];
};
