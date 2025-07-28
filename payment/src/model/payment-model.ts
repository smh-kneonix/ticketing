import mongoose from "mongoose";

export interface IPayment {
    orderId: string;
    refId: string;
}

interface IPaymentDoc extends mongoose.Document, IPayment {}

interface IPaymentModel extends mongoose.Model<IPaymentDoc> {
    build(user: IPayment): IPaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        refId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>(
    "Payment",
    paymentSchema
);

export { Payment };
