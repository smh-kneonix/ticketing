import { expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { signup } from "../../tests/auth-helper";
import { findAllTickets } from "../../repository/ticket-rep";
import { sendCreatedMassageMock } from "../../tests/jest.setup";

it("has a route handler listening to /api/ticket fro past request", async () => {
    const res = await request(app).post("/api/tickets").send({});

    expect(res.status).not.toEqual(404);
});

it("can only be access if the user is singed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
});

it("return status other than 401 if the user is signed in", async () => {
    const cookie = signup();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});
    expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    const cookie = signup();
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 100,
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            price: 100,
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    const cookie = signup();
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 0,
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: -10,
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test",
        })
        .expect(400);
});

it("create ticket with valid input", async () => {
    const cookie = signup();
    let tickets = await findAllTickets();
    expect(tickets.length).toEqual(0);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(201);

    tickets = await findAllTickets();
    expect(tickets.length).toEqual(1);
});

it("publish an event for created ticket", async () => {
    const cookie = signup();
    let tickets = await findAllTickets();
    expect(tickets.length).toEqual(0);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 100,
        })
        .expect(201);

    tickets = await findAllTickets();
    expect(tickets.length).toEqual(1);
    expect(sendCreatedMassageMock).toHaveBeenCalled();
});
