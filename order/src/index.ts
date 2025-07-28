import http from "http";
import { mongoConnect } from "./utilities";
import app from "./app";
import { initializeKafkaProducer } from "./events/producer/connect-kafka-producer";
import { initKafkaTicketConsumerListener } from "./events/consumer/ticket.consumer";
import { initKafkaExpirationConsumerListener } from "./events/consumer/expiration.consumer";
import { initKafkaPaymentConsumerListener } from "./events/consumer/payment.consumer";
import { ETopic } from "@kneonix-ticketing/common";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect(process.env.MONGO_URL as string); // connect to database before run server

    await initializeKafkaProducer(
        "order",
        [process.env.KAFKA_BROKER_URI as string],
        [
            { name: ETopic.OrderCancelled, numPartitions: 2 },
            { name: ETopic.OrderCreated, numPartitions: 3 },
        ]
    );

    await initKafkaTicketConsumerListener("order", [
        process.env.KAFKA_BROKER_URI as string,
    ]);
    await initKafkaExpirationConsumerListener("order", [
        process.env.KAFKA_BROKER_URI as string,
    ]);
    await initKafkaPaymentConsumerListener("order", [
        process.env.KAFKA_BROKER_URI as string,
    ]);

    server.listen(PORT, () => {
        console.log(`server run on port: ${PORT}`);
    });
}
startServer();
