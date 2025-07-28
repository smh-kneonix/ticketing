import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    EOrderStatus,
    validate,
} from "@kneonix-ticketing/common";
import { PaymentOrderValidation } from "../validation";
import {
    findOrderById,
    updateOrderAuthorityById,
} from "../repository/order-rep";
import axios, { AxiosError } from "axios";

const router = express.Router();

router.post(
    "/api/payments",
    authenticateMid("all"),
    PaymentOrderValidation,
    validate,
    async (req: Request, res: Response) => {
        const order = await findOrderById(req.body.orderId);
        if (!order) {
            throw new BadRequestError("Order not found");
        }
        if (order.userId !== req.currentUser!.id) {
            throw new BadRequestError(
                "You are not authorized to pay for this order"
            );
        }
        if (order.status !== EOrderStatus.Created) {
            throw new BadRequestError(
                "You can only pay for orders that are in the created state"
            );
        }

        // send request to payment and get back authority
        const zarinpalApiUrl = process.env.ZARINPAL_API_URL;
        try {
            const response = await axios.post(
                `${zarinpalApiUrl}/pg/v4/payment/request.json`,
                {
                    merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                    amount: order.price,
                    callback_url: process.env.ZARINPAL_CALLBACK_URL,
                    description: `payment for order: ${order.id}`,
                    metadata: {
                        orderId: order.id,
                    },
                }
            );

            if (response.data.data.code === 100) {
                const authority = response.data.data.authority;
                await updateOrderAuthorityById(order.id, authority);
                res.send({
                    url: `${zarinpalApiUrl}/pg/StartPay/${authority}`,
                });
            } else {
                throw new BadRequestError(
                    `Payment request failed with status: ${response.data.data.status}`
                );
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error instanceof AxiosError && error.request) {
                console.log(error.request);
            } else if (error instanceof AxiosError) {
                console.log("Error", error.message);
            }
            throw new BadRequestError("Failed to initiate payment request");
        }
    }
);

export { router as paymentRoute };
