import mongoose from "mongoose";

export interface ITicket {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
}

interface ITicketDoc extends mongoose.Document, ITicket {}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
    build(user: ITicket): ITicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            require: true,
            min: 1,
        },
        userId: {
            type: String,
            require: true,
        },
        orderId: {
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
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };
