import {
    EOrderStatus,
    IPaymentCreatedEvent,
} from "@kneonix-ticketing/common";
import {
    findOrderById,
    updateOrderStatusById,
} from "../../../repository/order-rep";

export const handleOrderPayment = async (
    data: IPaymentCreatedEvent["data"]
): Promise<void> => {
    const order = await findOrderById(data.orderId);
    if (!order) throw new Error("Order not found");
    await updateOrderStatusById(data.orderId, EOrderStatus.Completed);
    
    console.log("Order completed");
};
