import express, { Request, Response } from "express";
import { authenticateMid, validate } from "@kneonix-ticketing/common";
import { createTicketValidation } from "../validation";
import { createTicket } from "../repository/ticket-rep";
import { getTicketCreatedProducer } from "../events/producer/ticket-created.producer";

const router = express.Router();

router.post(
    "/api/tickets",
    authenticateMid("all"),
    createTicketValidation,
    validate,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const userId = req.currentUser!.id as string;
        const ticket = await createTicket({ title, price, userId });

        const producer = getTicketCreatedProducer();
        await producer.sendMassage([
            {
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
            },
        ]);

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
