import request from "supertest";
import app from "../../app";
import { it, expect } from "@jest/globals";
import { signup } from "../../tests/auth-helper";
import { createTicket } from "../../tests/ticket-helper";
import mongoose from "mongoose";
import { findTicketById } from "../../repository/ticket-rep";
import { sendUpdatedMassageMock } from "../../tests/jest.setup";
import { createTicket as repCreateTicket } from "../../repository/ticket-rep";

it("404 id not exist", async () => {
    const cookie = signup();
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(404);
});

it("400 id bad id", async () => {
    const cookie = signup();
    await request(app)
        .put("/api/tickets/test")
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(400);
});

it("401 unauthorize", async () => {
    await request(app)
        .put(`/api/tickets/test`)
        .send({
            title: "test",
            price: 100,
        })
        .expect(401);
});

it("403 forbidden user not owner", async () => {
    const cookie = signup();
    const { id } = await createTicket(cookie, app, {
        title: "name",
        price: 20,
    });
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signup())
        .send({
            title: "test",
            price: 100,
        })
        .expect(403);
});

it("400 invalid title", async () => {
    const cookie = signup();
    const newTicket = await createTicket(cookie, app, {
        title: "name",
        price: 20,
    });
    await request(app)
        .put(`/api/tickets/${newTicket.id}`)
        .set("Cookie", cookie)
        .send({
            price: 100,
        })
        .expect(400);
    await request(app)
        .put(`/api/tickets/${newTicket.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 100,
        })
        .expect(400);
});

it("400 invalid title", async () => {
    const cookie = signup();
    const { id } = await createTicket(cookie, app, {
        title: "name",
        price: 20,
    });
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 0,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: -20,
        })
        .expect(400);
});

it("update ticket", async () => {
    const cookie = signup();
    const { id } = await createTicket(cookie, app, {
        title: "name",
        price: 20,
    });

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(200);
    const targetTicket = await findTicketById(id);
    expect(targetTicket?.title).toEqual("test");
    expect(targetTicket?.price).toEqual(100);
});

it("publish an event for updated ticket", async () => {
    const cookie = signup();
    const { id } = await createTicket(cookie, app, {
        title: "name",
        price: 20,
    });

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(200);
    const targetTicket = await findTicketById(id);
    expect(targetTicket?.title).toEqual("test");
    expect(targetTicket?.price).toEqual(100);
    expect(sendUpdatedMassageMock).toHaveBeenCalled();
});

it("reject ticket if its reserve", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = signup(userId);
    const ticket = await repCreateTicket({
        title: "test",
        price: 100,
        userId: userId,
        orderId: new mongoose.Types.ObjectId().toHexString(),
    });

    await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(400);
});
