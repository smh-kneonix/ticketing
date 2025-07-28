import request from "supertest";
import { Application } from "express";

export const createTicket = async (
    cookie: string[],
    app: Application,
    ticket: object
) => {
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(ticket)
        .expect(201);
    return res.body;
};
