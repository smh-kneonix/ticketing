import express, { Request, Response } from "express";
import { findAllTickets } from "../repository/ticket-rep";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
    res.status(200).send(await findAllTickets());
});

export { router as getAllTicketsRouter };
