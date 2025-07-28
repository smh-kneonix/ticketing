import {
    AbstractKafkaProducer,
    ETopic,
    IExpirationCompleteEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer } from "./connect-kafka-producer";

export class OrderExpireProducer extends AbstractKafkaProducer<IExpirationCompleteEvent> {
    constructor(producer: Producer) {
        super(ETopic.ExpirationComplete, producer);
    }
    async sendMassage(messages: IExpirationCompleteEvent["data"][]) {
        this.send(messages);
    }
}

export const getOrderExpireProducer = () => {
    return new OrderExpireProducer(getKafkaProducer());
};
