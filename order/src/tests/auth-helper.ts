import { EUserRole } from "@kneonix-ticketing/common";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = (
    email: string = "test@example.com",
    role: EUserRole = EUserRole.ADMIN
): string[] => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(), // Use a valid test user ID
        email,
        role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!, {
        expiresIn: "15m",
    });

    return [`jwt=${token}`];
};
