import { body } from "express-validator";

export const updateTicketValidation = [
    body("title").notEmpty().isString().withMessage("Invalid title"),

    body("price").notEmpty().isFloat({ gt: 0 }).withMessage("invalid price"),
];
