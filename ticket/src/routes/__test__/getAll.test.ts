import request from "supertest";
import app from "../../app";
import { it, expect } from "@jest/globals";
import { signup } from "../../tests/auth-helper";
import { createTicket } from "../../tests/ticket-helper";

it("200 list of the tickets", async () => {
    await createTicket(signup(), app, {
        title: "test2",
        price: 100,
    });
    await createTicket(signup(), app, {
        title: "test2",
        price: 101,
    });

    await request(app)
        .get("/api/tickets")
        .expect(200)
        .then((res) => {
            expect(res.body.length).toEqual(2);
        });
});
