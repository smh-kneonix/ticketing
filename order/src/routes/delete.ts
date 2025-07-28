import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    EOrderStatus,
    NotFoundError,
    UnAuthorized,
    validate,
} from "@kneonix-ticketing/common";
import mongoose from "mongoose";
import { findOrderById, updateOrderStatusById } from "../repository/order-rep";
import { getOrderCancelledProducer } from "../events/producer/order-cancelled.producer";

const router = express.Router();

router.delete(
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
        const newOrder = await updateOrderStatusById(
            id,
            EOrderStatus.Cancelled
        );
        await getOrderCancelledProducer().sendMassage([
            {
                id: order.id,
                ticket: {
                    id: order.ticket.id,
                },
            },
        ]);
        res.status(204).send(newOrder);
    }
);

export { router as deleteOrder };
