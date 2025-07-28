import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { Types } from "mongoose";
import { signup } from "../../tests/auth-helper";
import axios from "axios";
import {
    createOrder,
    updateOrderAuthorityById,
    findOrderByAuthority,
} from "../../repository/order-rep";
import { createPayment, findPaymentByRefId } from "../../repository/payment-rep";
import { EOrderStatus } from "@kneonix-ticketing/common";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GET /api/payments/verify", () => {
    let userId: string;
    let order: any;
    beforeEach(async () => {
        userId = new Types.ObjectId().toHexString();
        order = await createOrder({
            userId,
            status: EOrderStatus.Created,
            price: 1000,
        });
        await updateOrderAuthorityById(order.id, "AUTH123");
        process.env.ZARINPAL_API_URL = "http://zarinpal.test";
        process.env.ZARINPAL_MERCHANT_ID = "merchant";
    });

    it("returns failed if Authority or Status missing", async () => {
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({})
            .expect(400);
        expect(res.body.errors[0].message).toMatch(/Authority and Status are required/);
    });

    it("returns failed if order not found or Status not OK", async () => {
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "BAD_AUTH", Status: "OK" })
            .expect(200);
        expect(res.body.status).toBe("failed");
    });

    it("returns failed if Status is not OK", async () => {
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "AUTH123", Status: "FAILED" })
            .expect(200);
        expect(res.body.status).toBe("failed");
    });

    it("returns success and saves payment if code 100", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { code: 100, ref_id: "REF123" } },
        });
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "AUTH123", Status: "OK" })
            .expect(200);
        expect(res.body.status).toBe("success");
        expect(res.body.refId).toBe("REF123");
    });

    it("returns success and finds payment if code 101", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { code: 101, ref_id: "REF101" } },
        });
        await createPayment({ orderId: order.id, refId: "REF101" });
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "AUTH123", Status: "OK" })
            .expect(200);
        expect(res.body.status).toBe("success");
        expect(res.body.refId).toBe("REF101");
    });

    it("returns failed if code is not 100 or 101", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { code: 200 } },
        });
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "AUTH123", Status: "OK" })
            .expect(200);
        expect(res.body.status).toBe("failed");
    });

    it("returns failed if axios throws", async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error("network error"));
        const res = await request(app)
            .get("/api/payments/verify")
            .set("Cookie", signup(userId))
            .query({ Authority: "AUTH123", Status: "OK" })
            .expect(200);
        expect(res.body.status).toBe("failed");
    });
});
