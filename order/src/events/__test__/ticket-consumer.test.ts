import { Consumer, KafkaMessage } from "kafkajs";
import {
    ETopic,
    ITicketCreatedEvent,
    ITicketUpdatedEvent,
} from "@kneonix-ticketing/common";
import { TicketConsumerListener } from "../consumer/ticket.consumer";
import { createTicketById, findTicketById } from "../../repository/ticket-rep";
import mongoose from "mongoose";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("Ticket Consumer", () => {
    let mockConsumer: Consumer;
    let ticketConsumer: TicketConsumerListener;
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

        ticketConsumer = new TicketConsumerListener(mockConsumer);
    });

    it("creates a ticket when ticket created event is received", async () => {
        const mockTicketData: ITicketCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };

        await ticketConsumer.onMessage(
            ETopic.TicketCreated,
            0,
            { offset: "1" } as KafkaMessage,
            mockTicketData
        );

        const savedTicket = await findTicketById(mockTicketData.id);
        expect(savedTicket).toBeDefined();
        expect(savedTicket!.id).toEqual(mockTicketData.id);
        expect(savedTicket!.title).toEqual(mockTicketData.title);
        expect(savedTicket!.price).toEqual(mockTicketData.price);
    });

    it("updates a ticket when ticket updated event is received", async () => {
        // First create a ticket
        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const userId = new mongoose.Types.ObjectId().toHexString();
        await createTicketById({
            id: ticketId,
            title: "test1",
            price: 100,
        });

        // Then update it
        const updatedTicketData: ITicketUpdatedEvent["data"] = {
            id: ticketId,
            title: "updated ticket",
            price: 20,
            userId: userId,
        };

        await ticketConsumer.onMessage(
            ETopic.TicketUpdated,
            0,
            { offset: "2" } as KafkaMessage,
            updatedTicketData
        );

        const savedTicket = await findTicketById(ticketId);
        expect(savedTicket).toBeDefined();
        expect(savedTicket!.id).toEqual(updatedTicketData.id);
        expect(savedTicket!.title).toEqual(updatedTicketData.title);
        expect(savedTicket!.price).toEqual(updatedTicketData.price);
    });

    it("acknowledges the message after successful processing", async () => {
        const mockTicketData: ITicketCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };

        const mockMessage = { offset: "1" } as KafkaMessage;
        const mockTopic = ETopic.TicketCreated;
        const mockPartition = 0;

        const massageAckSpy = jest.spyOn(ticketConsumer, "massageAck");

        await ticketConsumer.onMessage(
            mockTopic,
            mockPartition,
            mockMessage,
            mockTicketData
        );

        expect(massageAckSpy).toHaveBeenCalledWith(
            mockTopic,
            mockPartition,
            mockMessage.offset
        );
    });

    it("handles errors without crashing", async () => {
        const invalidTicketData = {
            id: "invalid-id", // This should cause mongoose validation to fail
            title: "test ticket",
            price: 10,
            userId: "invalid-user-id",
        };

        await expect(
            ticketConsumer.onMessage(
                ETopic.TicketCreated,
                0,
                { offset: "1" } as KafkaMessage,
                invalidTicketData as any
            )
        ).resolves.not.toThrow();
    });

    it("do NOT call the ack function if the offset is out of order", async () => {
        const mockTicketData: ITicketCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        ticketConsumer.onMessage(
            ETopic.TicketCreated,
            1,
            { offset: "1" } as KafkaMessage,
            mockTicketData
        );
        const massageAckSpy = jest.spyOn(ticketConsumer, "massageAck");
        expect(massageAckSpy).not.toHaveBeenCalled();
    });
});
