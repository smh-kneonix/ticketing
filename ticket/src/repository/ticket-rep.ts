import { Ticket, ITicket } from "../model/ticket-model";

export const findTicketById = async (id: string): Promise<ITicket | null> => {
    return await Ticket.findById(id);
};

export const findTicketsByUserId = async (userId: string) => {
    return await Ticket.find({ userId });
};

export const findAllTickets = async () => {
    return await Ticket.find({});
};

export const createTicket = async (ticket: ITicket) => {
    const newTicket = new Ticket(ticket);
    return await newTicket.save();
};

export const updateTicketById = async (
    id: string,
    title: string,
    price: number
) => {
    return await Ticket.findByIdAndUpdate(id, { title, price }, { new: true });
};

export const updateTicketOrderById = async (
    ticketId: string,
    orderId: string | null
): Promise<ITicket | null> => {
    return await Ticket.findByIdAndUpdate(ticketId, { orderId }, { new: true });
};

export const createTicketById = async (_id: string, ticket: ITicket) => {
    const newTicket = new Ticket({
        _id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderid: ticket.orderId,
    });
    return await newTicket.save();
};
