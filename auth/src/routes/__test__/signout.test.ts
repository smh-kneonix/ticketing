import request from "supertest";
import { it, expect } from "@jest/globals";
import app from "../../app";

it("return 200 on successful signout", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "exam@exam.com",
            password: "Aa123456@#",
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);
    expect(response.get("Set-Cookie")?.toString()).toBe(
        "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
});
