import { body } from "express-validator";

export const signinValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty()
        .withMessage("you must specify a password"),
];
