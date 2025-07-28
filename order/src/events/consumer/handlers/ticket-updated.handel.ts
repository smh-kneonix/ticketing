import { ITicketUpdatedEvent } from "@kneonix-ticketing/common";
import { findTicketById, updateTicket } from "../../../repository/ticket-rep";

export const handleTicketUpdated = async (
    data: ITicketUpdatedEvent["data"]
): Promise<void> => {
    const ticket = await findTicketById(data.id);
    if (!ticket) {
        console.error(`Ticket with id ${data.id} not found`);
        return;
    }

    await updateTicket({
        id: data.id,
        title: data.title,
        price: data.price,
    });
};
