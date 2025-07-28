import {
    AbstractKafkaProducer,
    ETopic,
    IOrderCreatedEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer } from "./connect-kafka-producer";

export class OrderCreatedProducer extends AbstractKafkaProducer<IOrderCreatedEvent> {
    constructor(producer: Producer) {
        super(ETopic.OrderCreated, producer);
    }
    async sendMassage(messages: IOrderCreatedEvent["data"][]) {
        this.send(messages);
    }
}

export const getOrderCreatedProducer = () => {
    return new OrderCreatedProducer(getKafkaProducer());
};
