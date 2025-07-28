import { expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { signup } from "../../tests/auth-helper";
import { createTicketById } from "../../repository/ticket-rep";
import { EOrderStatus, EUserRole } from "@kneonix-ticketing/common";
import { findOrderById } from "../../repository/order-rep";
import { Types } from "mongoose";
import { sendCancelledMassageMock } from "../../tests/jest.setup";

it("Delete /orders/:id 400 invalid id", async () => {
    const cookie = signup("user1@gmail.com", EUserRole.USER);

    const response = await request(app)
        .delete(`/api/orders/123456`)
        .set("Cookie", cookie)
        .expect(400);

    expect(response.body.errors[0].message).toEqual("invalid id");
});

it("Delete /orders/:id 404 order not found", async () => {
    const cookie = signup("user1@gmail.com", EUserRole.USER);

    const id = new Types.ObjectId().toHexString();
    const response = await request(app)
        .delete(`/api/orders/${id}`)
        .set("Cookie", cookie)
        .expect(404);

    expect(response.body.errors[0].message).toEqual("Order not found");
});

it("Delete /orders/:id 401 UnAuthorized", async () => {
    const cookie1 = signup("user1@gmail.com", EUserRole.USER);
    const cookie2 = signup("user2@gmail.com", EUserRole.USER);
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test1",
        price: 100,
    });
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie1)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    const response = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", cookie2)
        .expect(401);
    expect(response.body.errors[0].message).toEqual("not authorized");
});

it("Delete /orders/:id 204 order delete successfully", async () => {
    const cookie = signup("user1@gmail.com", EUserRole.USER);
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test1",
        price: 100,
    });
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", cookie)
        .expect(204);

    const targetOrder = await findOrderById(order.id);
    expect(targetOrder?.status).toEqual(EOrderStatus.Cancelled);
});

it("Delete /orders/:id 204 ", async () => {
    const cookie = signup("user1@gmail.com", EUserRole.USER);
    const ticket = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test1",
        price: 100,
    });
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", cookie)
        .expect(204);

    const targetOrder = await findOrderById(order.id);
    expect(targetOrder?.status).toEqual(EOrderStatus.Cancelled);
    expect(sendCancelledMassageMock).toHaveBeenCalled();
});
