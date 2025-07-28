import request from "supertest";
import { it, expect } from "@jest/globals";
import app from "../../app";
import { signup } from "../../tests/auth-helper";

it("return 200 on successful signin", async () => {
    const cookie = await signup();
    const currentUserRes = await request(app)
        .get("/api/users/current-user")
        .set("Cookie", cookie!)
        .send()
        .expect(200);
    expect(currentUserRes.body.user.email).toBe("exam@exam.com");
});

it("return 401 if not authenticated", async () => {
    await request(app)
        .get("/api/users/current-user")
        .set("Cookie", "")
        .send()
        .expect(401);
});
