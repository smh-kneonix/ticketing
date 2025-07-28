import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoConnect } from "../utilities";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = "testkey";
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoConnect(mongoUri);
});

afterEach(async () => {
    const collections = await mongoose.connection.db?.collections();
    if (collections) {
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});
