import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@kneonix-ticketing/common";
import cookieParser from "cookie-parser";
import { createOrder, getAllOrder, getOneOrder, deleteOrder } from "./routes";

const app = express();
app.use(json());

app.use(cookieParser());
app.use(createOrder);
app.use(getAllOrder);
app.use(getOneOrder);
app.use(deleteOrder);

app.all("*", async (req, res) => {
    throw new NotFoundError("page not found");
});

app.use(errorHandler);

export default app;
