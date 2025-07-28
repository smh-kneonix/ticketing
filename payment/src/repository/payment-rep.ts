import { IPayment, Payment } from "../model/payment-model";

export const createPayment = async (data: IPayment) => {
    return await Payment.create(data);
};

export const findPaymentByRefId = async (refId: string) => {
    return await Payment.findOne({ refId });
};