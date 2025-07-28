import useRequest from "../../hooks/useRequest";
import { useState } from "react";
import { useRouter } from "next/router";

const TicketShow = ({ ticket }) => {
    const [order, setOrder] = useState("");
    const router = useRouter();
    const { doRequest, errors } = useRequest();

    if (!ticket) {
        return (
            <div className="container py-5">
                <h2 className="fw-bold mb-4">Ticket Not Found</h2>
            </div>
        );
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest({
            url: "/api/orders/",
            method: "post",
            body: {
                ticketId: ticket.id,
            },
            onSuccess: (order) =>
                router.push("/orders/[orderId]", `/orders/${order.id}`),
        });
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Ticket Details</h2>
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title fw-bold">{ticket.title}</h5>
                    <p className="card-text mb-2">
                        Price: <span className="fw-bold">${ticket.price}</span>
                    </p>
                    <p className="card-text">
                        <small className="text-muted">
                            Ticket ID: {ticket.id}
                        </small>
                    </p>
                    <button
                        className="btn btn-outline-success"
                        onClick={onSubmit}
                    >
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    try {
        const { data } = await client.get(`/api/tickets/${ticketId}`);
        return { ticket: data };
    } catch {
        return { ticket: null };
    }
};

export default TicketShow;
