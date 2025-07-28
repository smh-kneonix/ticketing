import { Consumer, KafkaMessage } from "kafkajs";
import {
    ETopic,
    IOrderCreatedEvent,
    IOrderCancelledEvent,
    EOrderStatus,
} from "@kneonix-ticketing/common";
import { OrderConsumerListener } from "../order.consumer";
import {
    createTicketById,
    findTicketById,
    updateTicketOrderById,
} from "../../../repository/ticket-rep";
import mongoose from "mongoose";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { getTicketUpdatedProducer } from "../../producer/ticket-updated.producer";

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

    it("orderCreated set orderId", async () => {
        // Create a ticket first
        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const ticket = {
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        await createTicketById(ticketId, ticket);

        // Create the order event data
        const mockOrderData: IOrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: ticketId,
                price: ticket.price,
            },
        };

        await orderConsumer.onMessage(
            ETopic.OrderCreated,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );

        // Verify the ticket has been updated with the order ID
        const updatedTicket = await findTicketById(ticketId);
        expect(updatedTicket).toBeDefined();
        expect(updatedTicket!.orderId).toEqual(mockOrderData.id);
    });

    it("OrderCancelled unsets the orderId of the ticket when order cancelled event is received", async () => {
        // Create a ticket first

        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const ticket = {
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        await createTicketById(ticketId, ticket);

        // Set an orderId for the ticket
        const orderId = new mongoose.Types.ObjectId().toHexString();
        await updateTicketOrderById(ticketId, orderId);

        // Create the order cancelled event data
        const mockOrderData: IOrderCancelledEvent["data"] = {
            id: orderId,
            ticket: {
                id: ticketId,
            },
        };

        await orderConsumer.onMessage(
            ETopic.OrderCancelled,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );

        // Verify the ticket's orderId has been unset
        const updatedTicket = await findTicketById(ticketId);
        expect(updatedTicket).toBeDefined();
        expect(updatedTicket!.orderId).toBeNull();
    });

    it("acknowledges the message after successful processing", async () => {
        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const ticket = {
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        await createTicketById(ticketId, ticket);

        const mockOrderData: IOrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: ticketId,
                price: ticket.price,
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
            status: "created",
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: "invalid-ticket-id", // This will cause an error since the ticket doesn't exist
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

    it('createOrder send kafka message', async () => {
        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const ticket = {
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        await createTicketById(ticketId, ticket);

        const mockOrderData: IOrderCreatedEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: EOrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date().toISOString(),
            ticket: {
                id: ticketId,
                price: ticket.price,
            },
        };

        const sendMassageSpy = jest.spyOn(getTicketUpdatedProducer(), 'sendMassage');

        await orderConsumer.onMessage(
            ETopic.OrderCreated,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );
        expect(sendMassageSpy.mock.calls.flat(2).at(-1)).toEqual({
            id: ticketId,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: mockOrderData.id,
        });
    })

    it('cancelledOrder send kafka message', async () => {
        const ticketId = new mongoose.Types.ObjectId().toHexString();
        const ticket = {
            title: "test ticket",
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
        };
        await createTicketById(ticketId, ticket);

        const mockOrderData: IOrderCancelledEvent["data"] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            ticket: {
                id: ticketId,
            },
        };

        const sendMassageSpy = jest.spyOn(getTicketUpdatedProducer(), 'sendMassage');

        await orderConsumer.onMessage(
            ETopic.OrderCancelled,
            0,
            { offset: "1" } as KafkaMessage,
            mockOrderData
        );
        expect(sendMassageSpy.mock.calls.flat(2).at(-1)).toEqual({
            id: ticketId,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: undefined,
        });
    })
});
