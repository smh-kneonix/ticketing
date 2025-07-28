import mongoose from "mongoose";
import { EOrderStatus } from "@kneonix-ticketing/common";
import { ITicket, ITicketDoc } from "./ticket-model";

export interface IOrder {
    userId: string;
    status: EOrderStatus;
    expiresAt: Date;
    ticket: ITicketDoc;
}

export interface IOrderDoc extends mongoose.Document, IOrder {}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
    build(user: IOrder): IOrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
            enum: Object.values(EOrderStatus),
            default: EOrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
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
