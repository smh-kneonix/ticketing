import Link from "next/link";
import { useRouter } from "next/router";

const AllTickets = ({ tickets, currentUser }) => {
    const router = useRouter();
    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2 className="fw-bold mb-0">My Tickets</h2>
            </div>
            <div className="row g-3">
            {tickets?.length === 0 || !tickets ? (
                    <div className="col-12 text-center">
                        <p className="text-muted">No tickets found.</p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="col-12 col-md-6 col-lg-4"
                        >
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">
                                        {ticket.title}
                                    </h5>
                                    <p className="card-text mb-2">
                                        Price:{" "}
                                        <span className="fw-bold">
                                            ${ticket.price}
                                        </span>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Ticket ID: {ticket.id}
                                        </small>
                                    </p>
                                    <Link
                                        href={`/tickets/${ticket.id}`}
                                        passHref
                                        legacyBehavior
                                    >
                                        <a className="btn btn-sm btn-outline-primary mt-2">
                                            View Ticket
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

AllTickets.getInitialProps = async (context, client, currentUser) => {
    try {
        const { data } = await client.get(`/api/tickets/`);
        return { tickets: data, currentUser };
    } catch {
        return { tickets: null, currentUser };
    }
};

export default AllTickets;
