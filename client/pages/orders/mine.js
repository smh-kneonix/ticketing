import { useRouter } from "next/router";
import Link from "next/link";

const MyOrders = ({ orders, currentUser }) => {
    const router = useRouter();

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

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2 className="fw-bold mb-0">My Orders</h2>
            </div>
            <div className="row g-3">
                {orders?.length === 0 || !orders ? (
                    <div className="col-12 text-center">
                        <p className="text-muted">No orders found.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="col-12 col-md-6 col-lg-6"
                        >
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">
                                        {order.ticket.title}
                                    </h5>
                                    <p className="card-text mb-2">
                                        Status:{" "}
                                        <span className="fw-bold">
                                            {order.status}
                                        </span>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Expires at:{" "}
                                            {new Date(
                                                order.expiresAt
                                            ).toString()}
                                        </small>
                                    </p>
                                    <p className="card-text mb-2">
                                        Price:{" "}
                                        <span className="fw-bold">
                                            ${order.ticket.price}
                                        </span>
                                    </p>

                                    <Link
                                        href={`/orders/${order.id}`}
                                        passHref
                                        legacyBehavior
                                    >
                                        <a className="btn btn-sm btn-outline-primary mt-2">
                                            View Order
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

MyOrders.getInitialProps = async (context, client, currentUser) => {
    try {
        const { data } = await client.get(`/api/orders/`);
        return { orders: data, currentUser };
    } catch {
        return { orders: null, currentUser };
    }
};

export default MyOrders;
