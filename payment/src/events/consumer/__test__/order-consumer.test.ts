import { Consumer, KafkaMessage } from "kafkajs";
import {
    ETopic,
    IOrderCreatedEvent,
    IOrderCancelledEvent,
    EOrderStatus,
} from "@kneonix-ticketing/common";
import { OrderConsumerListener } from "../order.consumer";
import mongoose from "mongoose";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createOrderById, findOrderById } from "../../../repository/order-rep";

describe("Order Consumer", () => {
    let mockConsumer: Consumer;
    let orderConsumer: OrderConsumerListener;

    beforeEach(async () => {
        // Create a mock consumer with the required methods
        mockConsumer = {
            commitOffsets: jest.fn().mockImplementation(async (offsets) => {
                // This is a mock implementation of commitOffsets
                return Promise.resolve();
            }),
            connect: jest.fn(),
            disconnect: jest.fn(),
            run: jest.fn(),
            subscribe: jest.fn(),
            seek: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            describeGroup: jest.fn(),
            on: jest.fn(),
            events: {
                GROUP_JOIN: "",
                CONNECT: "",
                DISCONNECT: "",
                REQUEST_TIMEOUT: "",
                COMMIT_OFFSETS: "",
            },
            logger: jest.fn() as any,
            stop: jest.fn(),
            paused: jest.fn().mockReturnValue([]),
        } as unknown as Consumer;

        orderConsumer = new OrderConsumerListener(mockConsumer);
    });

    it("orderCreated create entity in order table", async () => {
        //send orderCreated message
        const orderId = new mongoose.Types.ObjectId().toHexString();
        const mockOrderData: IOrderCreatedEvent["data"] = {
            id: orderId,
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 100,
            },
        };

        await orderConsumer.onMessage(
            ETopic.OrderCreated,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );

        // Verify the order was created in the database
        const order = await findOrderById(orderId);
        expect(order).toBeDefined();
    });

    it("OrderCancelled message set the order status to cancelled", async () => {
        // Create a ticket first
        const orderId = new mongoose.Types.ObjectId().toHexString();
        await createOrderById(orderId, {
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            price: 100,
        });

        // Create the order cancelled event data
        const mockOrderData: IOrderCancelledEvent["data"] = {
            id: orderId,
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
            },
        };

        await orderConsumer.onMessage(
            ETopic.OrderCancelled,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );

        const order = await findOrderById(orderId);

        // Verify t1he ticket's orderId has been unset
        expect(order).toBeDefined();
        expect(order?.status).toBe(EOrderStatus.Cancelled);
    });

    it("acknowledges the message after successful processing", async () => {
        const mockOrderData: IOrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 100,
            },
        };

        const mockMessage = { offset: "1" } as KafkaMessage;
        const mockTopic = ETopic.OrderCreated;
        const mockPartition = 0;

        const massageAckSpy = jest.spyOn(orderConsumer, "massageAck");

        await orderConsumer.onMessage(
            mockTopic,
            mockPartition,
            mockMessage,
            mockOrderData
        );

        expect(massageAckSpy).toHaveBeenCalledWith(
            mockTopic,
            mockPartition,
            mockMessage.offset
        );
    });

    it("handles errors without crashing", async () => {
        const invalidOrderData = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 10,
            },
        };

        await expect(
            orderConsumer.onMessage(
                ETopic.OrderCreated,
                0,
                { offset: "1" } as KafkaMessage,
                invalidOrderData as any
            )
        ).resolves.not.toThrow();
    });
});
