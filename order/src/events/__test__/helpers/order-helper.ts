import mongoose from "mongoose";
import { EOrderStatus } from "@kneonix-ticketing/common";
import { createOrderById } from "../../../repository/order-rep";
import { createTicketById } from "../../../repository/ticket-rep";

export const createOrderForTesting = async (orderId?: string) => {
    // Generate orderId if not provided
    const actualOrderId =
        orderId || new mongoose.Types.ObjectId().toHexString();

    // Create ticket
    const ticket = await createTicketById({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Ticket",
        price: 20,
    });

    // Create order
    const order = await createOrderById(actualOrderId, {
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: EOrderStatus.Created,
        expiresAt: new Date(),
        ticket,
    });

    return { order, ticket };
};
