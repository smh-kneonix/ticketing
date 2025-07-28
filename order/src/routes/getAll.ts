import express, { Request, Response } from "express";
import { authenticateMid, validate } from "@kneonix-ticketing/common";
import { findOrdersByUserId } from "../repository/order-rep";

const router = express.Router();

router.get(
    "/api/orders",
    authenticateMid("all"),
    validate,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.id as string;
        const orders = await findOrdersByUserId(userId);

        res.status(200).send(orders);
    }
);

export { router as getAllOrder };
