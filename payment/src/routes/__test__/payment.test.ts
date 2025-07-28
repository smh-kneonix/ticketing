import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { Types } from "mongoose";
import { signup } from "../../tests/auth-helper";
import { EOrderStatus } from "@kneonix-ticketing/common";
import axios from "axios";
import {
    createOrder,
    updateOrderAuthorityById,
} from "../../repository/order-rep";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("POST /api/payments", () => {
    let userId: string;
    let otherUserId: string;
    let order: any;

    beforeEach(async () => {
        userId = new Types.ObjectId().toHexString();
        otherUserId = new Types.ObjectId().toHexString();
        order = await createOrder({
            userId,
            status: EOrderStatus.Created,
            price: 1000,
        });
        process.env.ZARINPAL_API_URL = "http://zarinpal.test";
        process.env.ZARINPAL_MERCHANT_ID = "merchant";
        process.env.ZARINPAL_CALLBACK_URL = "http://callback.test";
    });

    it("returns 400 if order not found", async () => {
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: new Types.ObjectId().toHexString() })
            .expect(400);
    });

    it("returns 400 if user is not authorized", async () => {
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(otherUserId))
            .send({ orderId: order.id })
            .expect(400);
    });

    it("returns 400 if order status is not 'created'", async () => {
        await updateOrderAuthorityById(order.id, null); // ensure no authority
        order.status = EOrderStatus.Cancelled;
        await order.save();
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: order.id })
            .expect(400);
    });

    it("returns 400 if order already has authority", async () => {
        await updateOrderAuthorityById(order.id, "already-paid");
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: order.id })
            .expect(400);
    });

    it("returns 201 and url if payment gateway returns success", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { code: 100, authority: "AUTH123" } },
        });
        const res = await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: order.id })
            .expect(200);
        expect(res.body.url).toContain("/pg/StartPay/AUTH123");
    });

    it("returns 400 if payment gateway returns error", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { code: 101, status: "error" } },
        });
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: order.id })
            .expect(400);
    });

    it("returns 400 if axios throws", async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error("network error"));
        await request(app)
            .post("/api/payments")
            .set("Cookie", signup(userId))
            .send({ orderId: order.id })
            .expect(400);
    });
});
