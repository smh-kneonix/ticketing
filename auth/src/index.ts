import http from "http";
import { mongoConnect } from "./utilities/mongo";
import app from "./app";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect(process.env.MONGO_URL as string); // connect to database before run server
    server.listen(PORT, () => {
        console.log(`server run on port: ${PORT}`);
    });
}

startServer();
