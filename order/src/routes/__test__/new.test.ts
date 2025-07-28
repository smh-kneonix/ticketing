import { expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { Types } from "mongoose";
import { signup } from "../../tests/auth-helper";
import { createTicketById } from "../../repository/ticket-rep";
import { createOrder } from "../../repository/order-rep";
import { EOrderStatus } from "@kneonix-ticketing/common";
import { sendCreatedMassageMock } from "../../tests/jest.setup";

it("POST /orders 404 ticket dose not exist", async () => {
    const cookie = signup();
    const ticketId = new Types.ObjectId();
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticketId,
        })
        .expect(404);

    expect(response.body.errors[0].message).toEqual("Ticket not found");
});

it("POST /orders 400 ticket already reserved", async () => {
    const cookie = signup();
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test",
        price: 100,
    });
    const order = await createOrder({
        userId: "test",
        status: EOrderStatus.Created,
        expiresAt: new Date(), // order expires at now but does not matter (its depend on status)
        ticket: ticket,
    });
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(400);

    expect(response.body.errors[0].message).toEqual(
        "Ticket is already reserved"
    );
});

it("POST /orders 200 ticket reserves", async () => {
    const cookie = signup();
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test",
        price: 100,
    });
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);
});

it("POST /orders 200 publish event", async () => {
    const cookie = signup();
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test",
        price: 100,
    });
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    expect(sendCreatedMassageMock).toHaveBeenCalled();
});
