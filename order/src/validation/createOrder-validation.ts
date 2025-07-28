import { body } from "express-validator";
import mongoose from "mongoose";

export const createOrderValidation = [
    body("ticketId")
        .notEmpty()
        .isString()
        .custom((input) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("Invalid ticket id"),
];
