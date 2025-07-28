import {
    EOrderStatus,
    IExpirationCompleteEvent,
} from "@kneonix-ticketing/common";
import {
    findOrderById,
    updateOrderStatusById,
} from "../../../repository/order-rep";
import { getOrderCancelledProducer } from "../../producer/order-cancelled.producer";

export const handleOrderExpiration = async (
    data: IExpirationCompleteEvent["data"]
): Promise<void> => {
    const order = await findOrderById(data.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === EOrderStatus.Completed) return;
    await updateOrderStatusById(data.orderId, EOrderStatus.Cancelled);
    await getOrderCancelledProducer().sendMassage([
        {
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
        },
    ]);
    console.log("Order expiration handled");
};
