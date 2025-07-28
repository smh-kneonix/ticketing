import { EOrderStatus } from "@kneonix-ticketing/common";
import mongoose from "mongoose";
import { Order } from "./order-model";

export interface ITicket {
    id: string;
    title: string;
    price: number;
}

export interface ITicketDoc extends Pick<mongoose.Document, Exclude<keyof mongoose.Document, 'id'>>, ITicket {
    isReserved(): Promise<boolean>;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
    build(user: ITicket): ITicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
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

const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

ticketSchema.methods.isReserved = async function () {
    const order = await Order.findOne({
        ticket: this,
        status: {
            $ne: EOrderStatus.Cancelled,
        },
    });
    return !!order;
};

export { Ticket };
