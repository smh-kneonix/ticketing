import { expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { signup } from "../../tests/auth-helper";
import mongoose from "mongoose";
import { createTicket } from "../../tests/ticket-helper";

it("has a route handler listening to /api/tickets/mine fro past request", async () => {
    const res = await request(app).get("/api/tickets/mine").send({});

    expect(res.status).not.toEqual(404);
});

it("can only be access if the user is singed in", async () => {
    await request(app).get("/api/tickets/mine").send({}).expect(401);
});

it("return status other than 401 if the user is signed in", async () => {
    const cookie = signup();
    const res = await request(app)
        .get("/api/tickets/mine")
        .set("Cookie", cookie)
        .send({});
    expect(res.status).not.toEqual(401);
});

it("should not return other user tickets", async () => {
    const user1Id = new mongoose.Types.ObjectId().toHexString();
    const user2Id = new mongoose.Types.ObjectId().toHexString();

    const cookieUser1 = signup(user1Id);
    const cookieUser2 = signup(user2Id);

    const ticketUser1 = await createTicket(cookieUser1, app, {
        title: "test",
        price: 100,
    });
    const ticketUser2 = await createTicket(cookieUser2, app, {
        title: "test",
        price: 100,
    });

    const res = await request(app)
        .get("/api/tickets/mine")
        .set("Cookie", cookieUser2)
        .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(ticketUser2.id);

});
