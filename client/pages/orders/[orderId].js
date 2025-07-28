import { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const OrderShow = ({ order, currentUser }) => {
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

    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest();
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newMsLeft = new Date(order.expiresAt) - new Date();
            if (newMsLeft <= 0) {
                // Order has expired, you can handle this case as needed
                setTimeLeft(0);
            } else {
                setTimeLeft(Math.round(newMsLeft / 1000));
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [order.expiresAt]);

    
    const onSubmitPay = async (event) => {
        event.preventDefault();
        doRequest({
            url: "/api/payments/",
            method: "post",
            body: {
                orderId: order.id,
            },
            onSuccess: ({ url }) => (window.location.href = url),
        });
    };

    const onSubmitCancel = async (event) => {
        event.preventDefault();
        doRequest({
            url: `/api/orders/${order.id}`,
            method: "delete",
            body: {},
            onSuccess: () =>
                router.push('/orders/mine'),
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="p-4 shadow rounded bg-white text-center">
                <h2 className="fw-bold mb-3">
                    Order Details for ticket: {order.ticket.title}
                </h2>
                <p className="text-muted">Order ID: {order.id}</p>
                <p className="text-muted">Status: {order.status}</p>
                <p className="text-muted">{timeLeft} until order expire</p>
                <p className="text-muted">Total Price: ${order.ticket.price}</p>
                {(order.status === "created" && timeLeft > 0) && (
                    <>
                        <button className="btn btn-outline-info" onClick={onSubmitPay}>
                            Pay
                        </button>
                        <button
                            className="btn btn-outline-danger ms-2"
                            onClick={onSubmitCancel}
                        >
                            Cancel Order
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    try {
        const { data } = await client.get(`/api/orders/${orderId}`);
        return { order: data, currentUser };
    } catch {
        return { order: null, currentUser };
    }
};

export default OrderShow;
