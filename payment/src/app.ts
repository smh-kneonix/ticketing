import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { paymentRoute } from "./routes/payment";
import { paymentVerifyRoute } from "./routes/verify";

import { errorHandler, NotFoundError } from "@kneonix-ticketing/common";
import cookieParser from "cookie-parser";

const app = express();
app.use(json());

app.use(cookieParser());
app.use(paymentRoute);
app.use(paymentVerifyRoute);

app.all("*", async (req, res) => {
    throw new NotFoundError("page not found");
});

app.use(errorHandler);

export default app;
