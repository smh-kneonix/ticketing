import Link from "next/link";

export default ({ currentUser }) => {
    return (
        <nav className="navbar navbar-dark navbar-expand-lg navbar-light bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                    Ticketing
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav ms-auto">
                        {currentUser ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/tickets/new">
                                        create ticket
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/tickets/mine"
                                    >
                                        my tickets
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/orders/mine"
                                    >
                                        my orders
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/auth/signout"
                                    >
                                        Sign Out
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/auth/profile"
                                    >
                                        <i
                                            class="bi bi-person-circle"
                                            style={{ fontSize: "18px" }}
                                        ></i>
                                    </a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/auth/signin">
                                        Sign In
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/auth/signup">
                                        Sign Up
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
