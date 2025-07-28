import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    validate,
    ForbiddenError,
    NotFoundError,
} from "@kneonix-ticketing/common";
import { updateTicketValidation } from "../validation";
import { findTicketById, updateTicketById } from "../repository/ticket-rep";
import { getTicketUpdatedProducer } from "../events/producer/ticket-updated.producer";
import mongoose from "mongoose";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    authenticateMid("all"),
    updateTicketValidation,
    validate,
    async (req: Request, res: Response) => {
        const ticketId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(ticketId))
            throw new BadRequestError("invalid id");

        const targetTicket = await findTicketById(ticketId);
        if (!targetTicket) throw new NotFoundError("ticket not found");
        if (targetTicket.orderId)
            throw new BadRequestError("ticket is reserved");

        const userId = req.currentUser!.id as string;
        if (userId !== targetTicket.userId)
            throw new ForbiddenError("user not owner");

        const { title, price } = req.body;
        const updatedTicket = await updateTicketById(ticketId, title, price);
        if (!updatedTicket) throw new BadRequestError("ticket not updated");
        await getTicketUpdatedProducer().sendMassage([
            {
                id: updatedTicket.id,
                title: updatedTicket.title,
                price: updatedTicket.price,
                userId: updatedTicket.userId,
            },
        ]);
        res.status(200).send(updatedTicket);
    }
);

export { router as updateTicket };
