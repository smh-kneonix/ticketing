import { Ticket, ITicket, ITicketDoc } from "../model/ticket-model";

export const findTicketById = async (
    id: string
): Promise<ITicketDoc | null> => {
    return await Ticket.findById(id);
};

export const updateTicket = async (ticket: ITicket) => {
    return await Ticket.findByIdAndUpdate(ticket.id, ticket, { new: true });
};

export const createTicketById = async (ticket: ITicket) => {
    const newTicket = new Ticket({
        _id: ticket.id,
        title: ticket.title,
        price: ticket.price,
    });
    return await newTicket.save();
};

export const findAllTickets = async (): Promise<ITicketDoc[]> => {
    return await Ticket.find({});
};
