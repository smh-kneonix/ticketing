import { IOrderCancelledEvent } from "@kneonix-ticketing/common";
import {
    findTicketById,
    updateTicketOrderById,
} from "../../../repository/ticket-rep";
import { getTicketUpdatedProducer } from "../../producer/ticket-updated.producer";

export const handleOrderCancelled = async (
    data: IOrderCancelledEvent["data"]
) => {
    const ticket = await findTicketById(data.ticket.id);
    if (!ticket) throw new Error("Ticket not found");
    const updatedTicket = await updateTicketOrderById(data.ticket.id, null)
    await getTicketUpdatedProducer().sendMassage([{
        id: data.ticket.id,
        title: updatedTicket!.title,
        price: updatedTicket!.price,
        userId: updatedTicket!.userId,
        orderId: undefined,
    }]);
};
