import {
    AbstractKafkaProducer,
    ETopic,
    ITicketCreatedEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer} from "./connect-kafka-producer";

export class TicketCreatedProducer extends AbstractKafkaProducer<ITicketCreatedEvent> {
    constructor(producer: Producer) {
        super(ETopic.TicketCreated, producer);
    }
    async sendMassage(messages: ITicketCreatedEvent["data"][]) {
        this.send(messages);
    }
}

// export const ticketCreatedProducer = new TicketCreatedProducer(getKafkaProducer());

export const getTicketCreatedProducer = () => {
  return new TicketCreatedProducer(getKafkaProducer());
};