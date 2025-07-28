import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    EOrderStatus,
    NotFoundError,
    validate,
} from "@kneonix-ticketing/common";
import { createOrderValidation } from "../validation/createOrder-validation";
import { findTicketById } from "../repository/ticket-rep";
import {
    findOrderByReservedTicket,
    createOrder,
} from "../repository/order-rep";
import { getOrderCreatedProducer } from "../events/producer/order-created.producer";
const router = express.Router();

router.post(
    "/api/orders",
    authenticateMid("all"),
    createOrderValidation,
    validate,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // find the ticket user is trying to order in the database
        const ticket = await findTicketById(ticketId);
        if (!ticket) throw new NotFoundError("Ticket not found");
        // make sure that this ticket is not already reserved
        const existingOrder = await findOrderByReservedTicket(ticket);
        if (existingOrder.length > 0)
            throw new BadRequestError("Ticket is already reserved");
        // calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(
            expiration.getSeconds() +
                Number(process.env.EXPIRATION_WINDOW_SECONDS)
        );
        // build the order and save it to the database
        const order = await createOrder({
            userId: req.currentUser!.id as string,
            status: EOrderStatus.Created,
            expiresAt: expiration,
            ticket,
        });

        // publish an event saying that an order was created
        await getOrderCreatedProducer().sendMassage([
            {
                id: order.id,
                userId: order.userId,
                status: order.status,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket.price,
                },
            },
        ]);
        res.status(201).send(order);
    }
);

export { router as createOrder };
