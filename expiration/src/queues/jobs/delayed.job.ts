import { IOrderExpirationPayload } from "../expiration.queues";
import { getOrderExpireProducer } from "../../events/producer/order-expire.producer";

export const sendDelayMessage = async (data: IOrderExpirationPayload) => {
    await getOrderExpireProducer().sendMassage([{ orderId: data.orderId }]);
};
