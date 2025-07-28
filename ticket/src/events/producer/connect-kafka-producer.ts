import { ETopic, initKafkaProducer } from "@kneonix-ticketing/common";
import { Producer } from "kafkajs";

let _producer: Producer | null = null;
export const initializeKafkaProducer = async (
    clientId: string,
    brokers: string[],
    topics: { name: ETopic; numPartitions: number }[]
) => {
    if (_producer) console.log("Kafka producer already initialized");
    _producer = await initKafkaProducer(clientId, brokers, topics);
};

export const getKafkaProducer = () => {
    if (!_producer) throw new Error("Kafka producer not initialized");
    return _producer;
};
