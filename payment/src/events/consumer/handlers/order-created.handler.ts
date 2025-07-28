import { IOrderCreatedEvent } from "@kneonix-ticketing/common";
import { createOrderById } from "../../../repository/order-rep";

export const handleOrderCreated = async (data: IOrderCreatedEvent["data"]) => {
    // Create order in the payment service
    await createOrderById(data.id, {
        status: data.status,
        userId: data.userId,
        price: data.ticket.price,
    });
};
