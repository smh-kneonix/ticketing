import { ETopic } from "@kneonix-ticketing/common";
import http from "http";
import app from "./app";
import { initKafkaOrderConsumerListener } from "./events/consumer/order.consumer";
import { initializeKafkaProducer } from "./events/producer/connect-kafka-producer";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    await initializeKafkaProducer(
        "expiration",
        [process.env.KAFKA_BROKER_URI as string],
        [
            {
                name: ETopic.ExpirationComplete,
                numPartitions: 1,
            },
        ]
    );
    await initKafkaOrderConsumerListener("expiration", [
        process.env.KAFKA_BROKER_URI as string,
    ]);

    server.listen(PORT, () => {
        console.log(`server run on port: ${PORT}`);
    });
}
startServer();
