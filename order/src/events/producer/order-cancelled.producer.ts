import {
    AbstractKafkaProducer,
    ETopic,
    IOrderCancelledEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer } from "./connect-kafka-producer";

export class OrderCancelledProducer extends AbstractKafkaProducer<IOrderCancelledEvent> {
    constructor(producer: Producer) {
        super(ETopic.OrderCancelled, producer);
    }
    async sendMassage(messages: IOrderCancelledEvent["data"][]) {
        this.send(messages);
    }
}

export const getOrderCancelledProducer = () => {
    return new OrderCancelledProducer(getKafkaProducer());
};
