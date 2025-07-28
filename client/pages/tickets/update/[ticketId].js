import { useState } from "react";
import useRequest from "../../../hooks/useRequest";
import { useRouter } from "next/router";

const TicketShow = ({ ticket, currentUser }) => {
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    if (!currentUser) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="p-4 shadow rounded bg-white text-center">
                    <h2 className="fw-bold mb-3">Access Denied</h2>
                    <p>Please sign in to view your tickets.</p>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="container py-5">
                <h2 className="fw-bold mb-4">Ticket Not Found</h2>
            </div>
        );
    }

    const [title, setTitle] = useState(ticket ? ticket.title : "");
    const [price, setPrice] = useState(ticket ? ticket.price : "");
    const router = useRouter();
    const { doRequest } = useRequest();
    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest({
            url: `/api/tickets/${ticket.id}`,
            method: "put",
            body: { title, price },
            onSuccess: () => router.push("../mine"),
        });
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Ticket Details</h2>
            <div className="card shadow-sm mb-4">
                <div className="card-body form-floating mb-3">
                    <form onSubmit={onSubmit}>
                        <h2 className="text-center mb-4 fw-bold">
                            update ticket {ticket.id}
                        </h2>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                placeholder="Title"
                                value={title}
                                defaultValue={ticket.title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="price"
                                placeholder="Price"
                                value={price}
                                defaultValue={ticket.price}
                                onChange={(e) => setPrice(e.target.value)}
                                onBlur={onBlur}
                                min="1"
                                required
                            />
                            <label htmlFor="price">Price</label>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-info w-100 fw-bold"
                        >
                            Update ticket Ticket
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
    const { ticketId } = context.query;
    try {
        const { data } = await client.get(`/api/tickets/${ticketId}`);
        return { ticket: data, currentUser };
    } catch {
        return { ticket: null, currentUser };
    }
};

export default TicketShow;
