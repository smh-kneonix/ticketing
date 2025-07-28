import { EOrderStatus, IOrderCancelledEvent } from "@kneonix-ticketing/common";
import {
    findOrderById,
    updateOrderStatusById,
} from "../../../repository/order-rep";

export const handleOrderCancelled = async (
    data: IOrderCancelledEvent["data"]
) => {
    const order = await findOrderById(data.id);
    if (!order) throw new Error("Order not found");
    await updateOrderStatusById(data.id, EOrderStatus.Cancelled);
};
