import { Consumer, KafkaMessage } from "kafkajs";
import {
    AbstractKafkaConsumer,
    ETopic,
    IOrderCreatedEvent,
    initKafkaConsumer,
} from "@kneonix-ticketing/common";
import { handleOrderCreated } from "./handlers/order-created.handler";

let _consumer: any = null;

export class OrderConsumerListener extends AbstractKafkaConsumer<IOrderCreatedEvent> {
    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onMessage(
        topic: string,
        partition: number,
        message: KafkaMessage,
        msg: IOrderCreatedEvent["data"]
    ): Promise<void> {
        try {
            switch (topic) {
                case ETopic.OrderCreated:
                    await handleOrderCreated(msg);
                    this.massageAck(
                        topic,
                        partition,
                        message.offset.toString()
                    );
                    break;
                default:
                    console.warn(`Unhandled topic: ${topic}`);
                    return;
            }
        } catch (error) {
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
        [ETopic.OrderCreated],
        clientId,
        brokers,
        "expiration:order-consumer",
        OrderConsumerListener
    );
};
