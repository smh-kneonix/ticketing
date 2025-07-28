import { Order, IOrder, IOrderDoc } from "../model/order-model";
import { EOrderStatus } from "@kneonix-ticketing/common";
import { ITicket } from "../model/ticket-model";

export const findOrderById = async (id: string): Promise<IOrderDoc | null> => {
    return await Order.findById(id).populate("ticket");
};

export const findOrdersByUserId = async (userId: string) => {
    return await Order.find({
        userId: userId,
    }).populate("ticket");
};

export const createOrder = async (order: IOrder) => {
    const newOrder = new Order(order);
    return await newOrder.save();
};

export const updateOrderStatusById = async (
    id: string,
    status: EOrderStatus
) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    ).populate("ticket");
    if (!updatedOrder) return null;
    return updatedOrder.toJSON();
};

export const findOrderByReservedTicket = async (ticket: ITicket) => {
    return await Order.find({
        ticket: ticket,
        status: {
            $in: [EOrderStatus.Created, EOrderStatus.AwaitingPayment],
        },
    });
};

export const createOrderById = async (orderId: string, order: IOrder) => {
    const newOrder = new Order({
        _id: orderId,
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt,
        ticket: order.ticket,
    });
    return await newOrder.save();
};
