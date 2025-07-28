import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoConnect } from "../utilities";
import { jest } from "@jest/globals";

export const sendCreatedMassageMock = jest.fn();
jest.mock("../events/producer/payment-created.producer", () => ({
    getPaymentCreatedProducer: () => ({
        sendMassage: sendCreatedMassageMock,
    }),
}));

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = "testkey";
    process.env.ZARINPAL_API_URL = 'https://sandbox.zarinpal.com';
    process.env.ZARINPAL_MERCHANT_ID = 'e6a3f4c3-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    process.env.ZARINPAL_CALLBACK_URL = 'https://ticketing.dev/payment/result';
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
