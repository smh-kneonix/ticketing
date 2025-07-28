import { IOrderCreatedEvent } from "@kneonix-ticketing/common";
import { expirationQueue } from "../../../queues/expiration.queues";
export const handleOrderCreated = async (data: IOrderCreatedEvent["data"]) => {
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    await expirationQueue.add(
        {
            orderId: data.id,
        },
        { delay }
    );
};
