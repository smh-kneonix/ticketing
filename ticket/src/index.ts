import { ETopic } from "@kneonix-ticketing/common";
import http from "http";
import app from "./app";
import { initKafkaOrderConsumerListener } from "./events/consumer/order.consumer";
import { initializeKafkaProducer } from "./events/producer/connect-kafka-producer";
import { mongoConnect } from "./utilities";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect(process.env.MONGO_URL as string); // connect to database before run server
    await initializeKafkaProducer(
        "ticket",
        [process.env.KAFKA_BROKER_URI as string],
        [
            {
                name: ETopic.TicketCreated,
                numPartitions: 1,
            },
            {
                name: ETopic.TicketUpdated,
                numPartitions: 1,
            },
        ]
    );
    await initKafkaOrderConsumerListener("ticket", [
        process.env.KAFKA_BROKER_URI as string,
    ]);

    server.listen(PORT, () => {
        console.log(`server run on port: ${PORT}`);
    });
}
startServer();
