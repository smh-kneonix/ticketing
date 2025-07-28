import { User } from "../models/user-model";
import { IUser } from "@kneonix-ticketing/common";

export async function findUserByEmail(email: string) {
    return await User.findOne({ email });
}

export async function createUser(user: IUser) {
    const newUser = await User.create(user);
    await newUser.save();
    return newUser;
}
