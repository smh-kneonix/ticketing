import mongoose from "mongoose";
import { EOrderStatus } from "@kneonix-ticketing/common";

export interface IOrder {
    userId: string;
    status: EOrderStatus; // EOrderStatus
    price: number;
    authority?: string; // Optional, used for payment authority
}

interface IOrderDoc extends mongoose.Document, IOrder {}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
    build(user: IOrder): IOrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(EOrderStatus),
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        authority: {
            type: String,
            require: false,
            default: null,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };
