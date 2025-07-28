import { IOrder, Order } from "../model/order-model";
import { EOrderStatus } from "@kneonix-ticketing/common";

export const createOrderById = async (orderId: string, orderData: IOrder) => {
    return await Order.create({
        _id: orderId,
        ...orderData,
    });
};

export const createOrder = async (data: IOrder) => {
    return await Order.create(data);
};

export const findOrderById = async (orderId: string) => {
    return await Order.findById(orderId);
};

export const updateOrderStatusById = async (
    orderId: string,
    status: EOrderStatus
) => {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

export const updateOrderAuthorityById = async (
    orderId: string,
    authority: string | null
) => {
    return await Order.findByIdAndUpdate(orderId, { authority }, { new: true });
};

export const findOrderByAuthority = async (authority: string) => {
    return await Order.findOne({ authority });
};
