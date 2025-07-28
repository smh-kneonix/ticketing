import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest } = useRequest();
    const router = useRouter();

    const onsubmit = async (event) => {
        event.preventDefault();
        doRequest({
            url: "/api/users/signup",
            method: "post",
            body: {
                email,
                password,
            },
            onSuccess: () => router.push("/auth/profile"),
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form
                className="p-4 shadow rounded bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={onsubmit}
            >
                <h2 className="text-center mb-4">Sign Up</h2>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-outline-info w-100">
                    Sign Up
                </button>
                {/* user already had an account */}
                <a
                    href="/auth/signin"
                    className="d-block mt-3 text-center text-secondary text-decoration-none"
                >
                    already had an account? Sign In
                </a>
            </form>
        </div>
    );
};
