import express, { Request, Response } from "express";
import { authenticateMid } from "@kneonix-ticketing/common";

const router = express.Router();

router.get(
    "/api/users/current-user",
    authenticateMid("all"),
    (req: Request, res: Response) => {
        res.send({ user: req.currentUser });
    }
);

export { router as currentUserRouter };
