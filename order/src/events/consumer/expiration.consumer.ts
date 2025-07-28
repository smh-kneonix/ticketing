import { Consumer, KafkaMessage } from "kafkajs";
import {
    AbstractKafkaConsumer,
    ETopic,
    IExpirationCompleteEvent,
    initKafkaConsumer,
} from "@kneonix-ticketing/common";
import { handleOrderExpiration } from "./handlers/order-expiration.handel";

let _consumer: any = null;

export class ExpirationConsumerListener extends AbstractKafkaConsumer<IExpirationCompleteEvent> {
    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onMessage(
        topic: ETopic,
        partition: number,
        message: KafkaMessage,
        msg: IExpirationCompleteEvent["data"]
    ): Promise<void> {
        try {
            switch (topic) {
                case ETopic.ExpirationComplete:
                    await handleOrderExpiration(
                        msg as IExpirationCompleteEvent["data"]
                    );
                    break;
                default:
                    console.error(`Unknown topic: ${topic}`);
                    return;
            }

            this.massageAck(topic, partition, message.offset.toString());
        } catch (error) {
            console.error(`Error processing ${topic}:`, error);
        }
    }
}

export const initKafkaExpirationConsumerListener = async (
    clientId: string,
    brokers: string[]
) => {
    if (_consumer) console.log("Kafka consumer already initialized");
    _consumer = await initKafkaConsumer(
        [ETopic.ExpirationComplete],
        clientId,
        brokers,
        "order:expiration-consumer",
        ExpirationConsumerListener
    );
};
