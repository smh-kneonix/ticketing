import request from "supertest";
import app from "../../app";
import { it } from "@jest/globals";
import { signup } from "../../tests/auth-helper";
import { createTicket } from "../../tests/ticket-helper";
import mongoose from "mongoose";

it("return 400 invalid id", async () => {
    await request(app).get("/api/tickets/test").expect(400);
});

it("return 404 not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).expect(404);
});

it("return 200 ticket found", async () => {
    const ticket = await createTicket(signup(), app, {
        title: "test",
        price: 100,
    });
    await request(app).get(`/api/tickets/${ticket.id}`).expect(200);
});
