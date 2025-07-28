import { body } from "express-validator";

export const signupValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password should between 8 and 20 characters long"),
];