import {
    AbstractKafkaProducer,
    ETopic,
    IPaymentCreatedEvent,
} from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";
import { getKafkaProducer } from "./connect-kafka-producer";

export class PaymentCreatedProducer extends AbstractKafkaProducer<IPaymentCreatedEvent> {
    constructor(producer: Producer) {
        super(ETopic.PaymentCreated, producer);
    }
    async sendMassage(messages: IPaymentCreatedEvent["data"][]) {
        this.send(messages);
    }
}

export const getPaymentCreatedProducer = () => {
    return new PaymentCreatedProducer(getKafkaProducer());
};
