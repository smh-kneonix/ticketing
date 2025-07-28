import request from "supertest";
import { it, expect } from "@jest/globals";
import app from "../../app";

it("return 201 on successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
});

it("return 400 invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "examexam.com",
            password: "Aa123456@#",
        })
        .expect(400);
});

it("return 400 invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "12",
        })
        .expect(400);
});

it("return 400 missing email or password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({ email: "exam@exam.com" })
        .expect(400);
    await request(app)
        .post("/api/users/signup")
        .send({ password: "Aa123456@#" })
        .expect(400);
    await request(app).post("/api/users/signup").send({}).expect(400);
});

it("return 400 disallow duplicate emails", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(201);
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(400);
});
