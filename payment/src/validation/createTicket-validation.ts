import { body } from "express-validator";

export const PaymentOrderValidation = [
    body("orderId")
        .notEmpty()
        .isString()
        .withMessage("Invalid order ID"),

];
