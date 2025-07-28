import { Consumer, KafkaMessage } from "kafkajs";
import {
    AbstractKafkaConsumer,
    ETopic,
    IOrderCancelledEvent,
    IOrderCreatedEvent,
    initKafkaConsumer,
} from "@kneonix-ticketing/common";
import { handleOrderCancelled } from "./handlers/order-cancelled.handler";
import { handleOrderCreated } from "./handlers/order-created.handler";

let _consumer: any = null;

export class OrderConsumerListener extends AbstractKafkaConsumer<
    IOrderCreatedEvent | IOrderCancelledEvent
> {
    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onMessage(
        topic: string,
        partition: number,
        message: KafkaMessage,
        msg: IOrderCreatedEvent["data"] | IOrderCancelledEvent["data"]
    ): Promise<void> {
        try {
            switch (topic) {
                case ETopic.OrderCreated:
                    await handleOrderCreated(msg as IOrderCreatedEvent["data"]);
                    break;
                case ETopic.OrderCancelled:
                    await handleOrderCancelled(
                        msg as IOrderCancelledEvent["data"]
                    );
                    break;
                default:
                    console.error(`Unknown topic: ${topic}`);
                    return;
            }
            this.massageAck(topic, partition, message.offset.toString());
        } catch (error)  {
            console.error(`Error processing ${topic}:`, error);
        }
    }
}

export const initKafkaOrderConsumerListener = async (
    clientId: string,
    brokers: string[]
) => {
    if (_consumer) console.log("Kafka consumer already initialized");
    _consumer = await initKafkaConsumer(
        [ETopic.OrderCreated, ETopic.OrderCancelled],
        clientId,
        brokers,
        "payment:order-consumer",
        OrderConsumerListener
    );
};
