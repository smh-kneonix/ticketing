import express, { Request, Response } from "express";
import { findTicketById } from "../repository/ticket-rep";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "@kneonix-ticketing/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequestError("invalid id");

    const targetTicket = await findTicketById(id);
    if (!targetTicket) throw new NotFoundError("ticket not found");
    res.status(200).send(targetTicket);
});

export { router as showTicketRouter };
