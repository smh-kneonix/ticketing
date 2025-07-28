import { IOrderCreatedEvent } from "@kneonix-ticketing/common";
import {
    findTicketById,
    updateTicketOrderById,
} from "../../../repository/ticket-rep";
import { getTicketUpdatedProducer } from "../../producer/ticket-updated.producer";

export const handleOrderCreated = async (data: IOrderCreatedEvent["data"]) => {
    const ticket = await findTicketById(data.ticket.id);
    if (!ticket) throw new Error("Ticket not found");
    await updateTicketOrderById(data.ticket.id, data.id);
    await getTicketUpdatedProducer().sendMassage([{
        id: data.ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: data.id,
    }]);
};
