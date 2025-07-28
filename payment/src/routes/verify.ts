import express, { Request, Response } from "express";
import {
    authenticateMid,
    BadRequestError,
    validate,
} from "@kneonix-ticketing/common";
import { findOrderByAuthority } from "../repository/order-rep";
import { createPayment, findPaymentByRefId } from "../repository/payment-rep";
import { getPaymentCreatedProducer } from "../events/producer/payment-created.producer";
import axios from "axios";

const router = express.Router();

router.get(
    "/api/payments/verify",
    authenticateMid("all"),
    validate,
    async (req: Request, res: Response) => {
        const { Authority, Status } = req.query;
        if (!Authority || !Status) {
            throw new BadRequestError("Authority and Status are required");
        }

        const order = await findOrderByAuthority(Authority as string);

        if (Status !== "OK" || !order) {
            res.send({ status: "failed", refId: "" });
            return;
        }

        try {
            const { data: response } = await axios.post(
                `${process.env.ZARINPAL_API_URL}/pg/v4/payment/verify.json`,
                {
                    merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                    amount: order.price,
                    authority: Authority,
                }
            );
            const status = response.data.code;
            if (status === 100) {
                const refId = response.data.ref_id;
                //save payment in to database
                const payment = await createPayment({
                    orderId: order.id,
                    refId,
                });
                // send payment created event
                await getPaymentCreatedProducer().sendMassage([
                    {
                        id: payment.id,
                        orderId: order.id,
                        refId: refId,
                    },
                ]);
                res.send({
                    status: "success",
                    refId,
                });
                return;
            } else if (status === 101) {
                const payment = await findPaymentByRefId(response.data.ref_id);
                res.send({
                    status: "success",
                    refId: payment?.refId || "",
                });
                return;
            } else {
                res.send({
                    status: "failed",
                    refId: "",
                });
                return;
            }
        } catch (err) {
            console.log(err)
            res.send({
                status: "failed",
                refId: "",
            });
            return;
        }
    }
);

export { router as paymentVerifyRoute };
