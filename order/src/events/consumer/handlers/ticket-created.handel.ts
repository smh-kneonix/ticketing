import { ITicketCreatedEvent } from "@kneonix-ticketing/common";
import { createTicketById } from "../../../repository/ticket-rep";

export const handleTicketCreated = async (
    data: ITicketCreatedEvent["data"]
): Promise<void> => {
    await createTicketById({
        id: data.id,
        title: data.title,
        price: data.price,
    });
};
