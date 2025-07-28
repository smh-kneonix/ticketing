import mongoose from "mongoose";
import { EUserRole, IUser } from "@kneonix-ticketing/common";

interface IUserDoc extends Omit<mongoose.Document, "id">, IUser {}
interface IUserModel extends mongoose.Model<IUserDoc> {
    build(user: IUser): IUserDoc;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: [EUserRole.USER, EUserRole.ADMIN],
            default: EUserRole.USER,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
