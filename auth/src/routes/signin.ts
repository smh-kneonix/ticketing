import express, { Request, Response } from "express";
import { signinValidation } from "../validation";
import { findUserByEmail } from "../repository/user-rep";
import { BadRequestError, validate } from "@kneonix-ticketing/common";
import { createJWT, Password } from "../utilities";

const router = express.Router();

router.post(
    "/api/users/signin",
    signinValidation,
    validate,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const targetUser = await findUserByEmail(email);
        if (!targetUser) throw new BadRequestError("wrong email or password"); // user not exist
        const match = await Password.compare(targetUser.password, password);
        if (!match) throw new BadRequestError("wrong email or password"); // wrong password
        const jwt = createJWT(targetUser.id, targetUser.email, targetUser.role);
        res.cookie("jwt", jwt);
        res.send({ user: targetUser });
    }
);

export { router as signinRouter };
