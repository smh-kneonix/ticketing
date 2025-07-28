import mongoose from "mongoose";

export const mongoConnect = async function (mongoUri: string) {
    try {
        await mongoose.connect(mongoUri);
    } catch (err) {
        console.log(err);
    }
};
