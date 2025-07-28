import Queue, { Job } from "bull";
import { sendDelayMessage } from "./jobs/delayed.job";

export interface IOrderExpirationPayload {
    orderId: string;
}

const expirationQueue = new Queue<IOrderExpirationPayload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!, 10),
    },
});

expirationQueue.process(async (job: Job<IOrderExpirationPayload>) => {
    await sendDelayMessage(job.data);
});

export { expirationQueue };
