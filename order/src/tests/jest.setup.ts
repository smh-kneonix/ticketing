import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoConnect } from "../utilities";
import { jest } from "@jest/globals";

export const sendCreatedMassageMock =
    jest.fn<
        (id: string, title: string, price: number, userId: string) => void
    >();
jest.mock("../events/producer/order-created.producer", () => ({
    getOrderCreatedProducer: () => ({
        sendMassage: sendCreatedMassageMock,
    }),
}));

export const sendCancelledMassageMock =
    jest.fn<
        (id: string, title: string, price: number, userId: string) => void
    >();
jest.mock("../events/producer/order-cancelled.producer", () => ({
    getOrderCancelledProducer: () => ({
        sendMassage: sendCancelledMassageMock,
    }),
}));

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = "testkey";
    process.env.EXPIRATION_WINDOW_SECONDS = '100';
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
