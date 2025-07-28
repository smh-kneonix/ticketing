import { Consumer, KafkaMessage } from "kafkajs";
import {
    AbstractKafkaConsumer,
    ETopic,
    ITicketCreatedEvent,
    ITicketUpdatedEvent,
    initKafkaConsumer,
} from "@kneonix-ticketing/common";
import { handleTicketCreated } from "./handlers/ticket-created.handel";
import { handleTicketUpdated } from "./handlers/ticket-updated.handel";

let _consumer: any = null;

export class TicketConsumerListener extends AbstractKafkaConsumer<
    ITicketCreatedEvent | ITicketUpdatedEvent
> {
    constructor(consumer: Consumer) {
        super(consumer);
    }

    async onMessage(
        topic: ETopic,
        partition: number,
        message: KafkaMessage,
        msg: ITicketCreatedEvent["data"] | ITicketUpdatedEvent["data"]
    ): Promise<void> {
        try {
            switch (topic) {
                case ETopic.TicketCreated:
                    await handleTicketCreated(
                        msg as ITicketCreatedEvent["data"]
                    );
                    break;
                case ETopic.TicketUpdated:
                    await handleTicketUpdated(
                        msg as ITicketUpdatedEvent["data"]
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

export const initKafkaTicketConsumerListener = async (
    clientId: string,
    brokers: string[]
) => {
    if (_consumer) console.log("Kafka consumer already initialized");
    _consumer = await initKafkaConsumer(
        [ETopic.TicketCreated, ETopic.TicketUpdated],
        clientId,
        brokers,
        "order:ticket-consumer",
        TicketConsumerListener
    );
};
