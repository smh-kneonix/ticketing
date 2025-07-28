import express, { Request, Response } from "express";
import { signupValidation } from "../validation";
import { createUser, findUserByEmail } from "../repository/user-rep";
import { BadRequestError } from "@kneonix-ticketing/common";
import { createJWT, Password } from "../utilities";
import { EUserRole, validate } from "@kneonix-ticketing/common";

const router = express.Router();
router.post(
    "/api/users/signup",
    signupValidation,
    validate,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const targetUser = await findUserByEmail(email);
        if (targetUser) throw new BadRequestError("email in use"); // check user not exist
        const hash = await Password.toHash(password); // hash the password
        const user = await createUser({
            email,
            password: hash,
            role: EUserRole.USER,
        });
        const jwt = createJWT(user.id, user.email, user.role);
        res.cookie("jwt", jwt);
        res.status(201).send({ user });
    }
);

export { router as signupRouter };
