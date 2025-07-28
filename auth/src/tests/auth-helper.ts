import request from "supertest";
import app from "../app";

export const signup = async () => {
    const email = "exam@exam.com";
    const password = "Aa123456@#";
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password,
        })
        .expect(201);
    const cookie = response.get("Set-Cookie");
    return cookie
};
