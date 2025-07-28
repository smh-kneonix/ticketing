import { expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { signup } from "../../tests/auth-helper";
import { createTicketById } from "../../repository/ticket-rep";
import { EUserRole } from "@kneonix-ticketing/common";
import { Types } from "mongoose";

it("Get /orders 200 orders fround", async () => {
    const cookie1 = signup("user1@gmail.com", EUserRole.USER);
    const cookie2 = signup("user1@gmail.com", EUserRole.USER);

    // create three ticket
    const ticket1 = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test1",
        price: 100,
    });

    const ticket2 = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test2",
        price: 200,
    });

    const ticket3 = await createTicketById({
        id: new Types.ObjectId().toHexString(),
        title: "test3",
        price: 300,
    });

    // one order as 1
    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie1)
        .send({
            ticketId: ticket1.id,
        })
        .expect(201);

    // one order as 2
    const { body: orderOne } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie2)
        .send({
            ticketId: ticket2.id,
        })
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie2)
        .send({
            ticketId: ticket3.id,
        })
        .expect(201);

    // make request to get order of user 2
    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", cookie2)
        .expect(200);

    // only get order of user 2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[0].ticket.id).toEqual(orderOne.ticket.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[1].ticket.id).toEqual(orderTwo.ticket.id);
});
