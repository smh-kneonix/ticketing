import { Consumer, KafkaMessage } from "kafkajs";
import {
    AbstractKafkaConsumer,
    ETopic,
    IPaymentCreatedEvent,
    initKafkaConsumer,
} from "@kneonix-ticketing/common";
import { handleOrderPayment } from "./handlers/order-payment.handel";

let _consumer: any = null;

export class PaymentConsumerListener extends AbstractKafkaConsumer<IPaymentCreatedEvent> {
    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onMessage(
        topic: ETopic,
        partition: number,
        message: KafkaMessage,
        msg: IPaymentCreatedEvent["data"]
    ): Promise<void> {
        try {
            switch (topic) {
                case ETopic.PaymentCreated:
                    await handleOrderPayment(
                        msg as IPaymentCreatedEvent["data"]
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

export const initKafkaPaymentConsumerListener = async (
    clientId: string,
    brokers: string[]
) => {
    if (_consumer) console.log("Kafka consumer already initialized");
    _consumer = await initKafkaConsumer(
        [ETopic.PaymentCreated],
        clientId,
        brokers,
        "order:payment-consumer",
        PaymentConsumerListener
    );
};
