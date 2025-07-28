import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { getAllTicketsRouter } from "./routes/getAll";
import { updateTicket } from "./routes/update";
import { myTickets } from "./routes/myTicket";

import { errorHandler, NotFoundError } from "@kneonix-ticketing/common";
import cookieParser from "cookie-parser";

const app = express();
app.use(json());

app.use(cookieParser());
app.use(createTicketRouter);
app.use(myTickets);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);
app.use(updateTicket);

app.all("*", async (req, res) => {
    throw new NotFoundError("page not found");
});

app.use(errorHandler);

export default app;
