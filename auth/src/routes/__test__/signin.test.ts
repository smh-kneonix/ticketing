import request from "supertest";
import { it, expect } from "@jest/globals";
import app from "../../app";

it("return 200 successfully signin", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
});

it("return 400 email not exist", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(400);
});

it("return 400 wrong password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "exam@exam.com",
            password: "Aa1234578@#",
        })
        .expect(400);
});

it("return 400 invalid email", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "examexam.com",
            password: "Aa123456@#",
        })
        .expect(400);
});

it("return 400 invalid password", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "exam@exam.com",
            password: "12",
        })
        .expect(400);
});

it("return 400 missing email or password", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({ email: "exam@exam.com" })
        .expect(400);
    await request(app)
        .post("/api/users/signin")
        .send({ password: "Aa123456@#" })
        .expect(400);
    await request(app).post("/api/users/signin").send({}).expect(400);
});
