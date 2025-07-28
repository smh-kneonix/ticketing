import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const NewTicket = (currentUser) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { doRequest } = useRequest();
    const router = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest({
            url: "/api/tickets/",
            method: "post",
            body: { title, price },
            onSuccess: () => router.push("mine"),
        });
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

    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form
                className="p-4 shadow rounded bg-white w-100"
                style={{ maxWidth: "400px" }}
                onSubmit={onSubmit}
            >
                <h2 className="text-center mb-4 fw-bold">Create New Ticket</h2>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Title"
                        value={title}
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
                    Create Ticket
                </button>
            </form>
        </div>
    );
};

NewTicket.getInitialProps = async (context, client, currentUser) => {
    return { currentUser };
};

export default NewTicket;
