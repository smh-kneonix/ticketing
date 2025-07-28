import { Consumer, KafkaMessage } from "kafkajs";
import { ETopic, IExpirationCompleteEvent } from "@kneonix-ticketing/common";
import { ExpirationConsumerListener } from "../consumer/expiration.consumer";
import mongoose from "mongoose";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { findOrderById } from "../../repository/order-rep";
import { EOrderStatus } from "@kneonix-ticketing/common";
import { createOrderForTesting } from "./helpers/order-helper";

describe("Expiration Consumer", () => {
    let mockConsumer: Consumer;
    let expirationConsumer: ExpirationConsumerListener;

    beforeEach(async () => {
        // Create a mock consumer with the required methods
        mockConsumer = {
            commitOffsets: jest.fn().mockImplementation(async (offsets) => {
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

        expirationConsumer = new ExpirationConsumerListener(mockConsumer);
    });
    it("updates order status to cancelled when expiration complete event is received", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();

        // Create order with ticket using helper
        const { order } = await createOrderForTesting(orderId);

        const mockExpirationData: IExpirationCompleteEvent["data"] = {
            orderId: orderId,
        };

        await expirationConsumer.onMessage(
            ETopic.ExpirationComplete,
            0,
            { offset: "1" } as KafkaMessage,
            mockExpirationData
        );

        const updatedOrder = await findOrderById(orderId);
        expect(updatedOrder).toBeDefined();
        expect(updatedOrder!.status).toEqual(EOrderStatus.Cancelled);
    });
    it("acknowledges the message after successful processing", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();

        // Create order with ticket using helper
        await createOrderForTesting(orderId);

        const mockExpirationData: IExpirationCompleteEvent["data"] = {
            orderId: orderId,
        };

        const mockMessage = { offset: "1" } as KafkaMessage;
        const mockTopic = ETopic.ExpirationComplete;
        const mockPartition = 0;

        const massageAckSpy = jest.spyOn(expirationConsumer, "massageAck");

        await expirationConsumer.onMessage(
            mockTopic,
            mockPartition,
            mockMessage,
            mockExpirationData
        );

        expect(massageAckSpy).toHaveBeenCalledWith(
            mockTopic,
            mockPartition,
            mockMessage.offset
        );
    });

    it("handles errors without crashing", async () => {
        const invalidExpirationData = {
            orderId: "invalid-order-id", // This should cause mongoose validation to fail
        };

        await expect(
            expirationConsumer.onMessage(
                ETopic.ExpirationComplete,
                0,
                { offset: "1" } as KafkaMessage,
                invalidExpirationData as any
            )
        ).resolves.not.toThrow();
    });

    it("does not call the ack function if the offset is out of order", async () => {
        const mockExpirationData: IExpirationCompleteEvent["data"] = {
            orderId: new mongoose.Types.ObjectId().toHexString(),
        };

        const massageAckSpy = jest.spyOn(expirationConsumer, "massageAck");

        await expirationConsumer.onMessage(
            ETopic.ExpirationComplete,
            1,
            { offset: "1" } as KafkaMessage,
            mockExpirationData
        );

        expect(massageAckSpy).not.toHaveBeenCalled();
    });
});
