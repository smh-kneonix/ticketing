const PaymentResult = ({ currentUser, paymentResult }) => {
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
                <h2 className="fw-bold mb-0">Payment Result</h2>
            </div>
            <div className="card shadow-sm">
                <div className="card-body text-center">
                    {paymentResult.status === "success" ? (
                        <>
                            <h5 className="card-title text-success">
                                Payment Successful{" "}
                                <i class="bi bi-check-square text-success"></i>
                            </h5>
                            <p className="card-text">
                                Your payment was successful. Reference ID:{" "}
                                {paymentResult.refId}
                            </p>
                        </>
                    ) : (
                        <>
                            <h5 className="card-title text-danger">
                                Payment Failed{" "}
                                <i class="bi bi-x-octagon text-danger"></i>
                            </h5>
                            <p className="card-text">
                                {
                                    "An error occurred while processing your payment."
                                }
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

PaymentResult.getInitialProps = async (context, client, currentUser) => {
    const { Authority, Status } = context.query;

    try {
        const { data } = await client.get(
            `/api/payments/verify?Authority=${Authority}&Status=${Status}`
        );
        return { currentUser, paymentResult: data };
    } catch (error) {
        return {
            currentUser,
            paymentResult: {
                status: "error",
                message: "Failed to verify payment.",
            },
        };
    }
};

export default PaymentResult;
