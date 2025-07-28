import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    NotFoundError,
    UnAuthorized,
    validate,
} from "@kneonix-ticketing/common";
import { findOrderById } from "../repository/order-rep";
import mongoose from "mongoose";

const router = express.Router();

router.get(
    "/api/orders/:id",
    authenticateMid("all"),
    validate,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestError("invalid id");

        const order = await findOrderById(id);
        if (!order) throw new NotFoundError("Order not found");
        if (order.userId !== req.currentUser!.id) {
            throw new UnAuthorized("not authorized");
        }

        res.status(200).send(order);
    }
);

export { router as getOneOrder };
