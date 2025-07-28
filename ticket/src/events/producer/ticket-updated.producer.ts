import {
    AbstractKafkaProducer,
    ETopic,
    ITicketUpdatedEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer } from "./connect-kafka-producer";

export class TicketUpdatedProducer extends AbstractKafkaProducer<ITicketUpdatedEvent> {
    constructor(producer: Producer) {
        super(ETopic.TicketUpdated, producer);
    }
    async sendMassage(messages: ITicketUpdatedEvent["data"][]) {
        this.send(messages);
    }
}

export const getTicketUpdatedProducer = () => {
    return new TicketUpdatedProducer(getKafkaProducer());
};
