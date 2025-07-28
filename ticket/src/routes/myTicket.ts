import express, { Request, Response } from "express";
import { authenticateMid, validate } from "@kneonix-ticketing/common";
import { findTicketsByUserId } from "../repository/ticket-rep";

const router = express.Router();

router.get(
    "/api/tickets/mine",
    authenticateMid("all"),
    validate,
    async (req: Request, res: Response) => {
        const tickets = await findTicketsByUserId(
            req.currentUser!.id as string
        );
        res.send(tickets);
    }
);

export { router as myTickets };
