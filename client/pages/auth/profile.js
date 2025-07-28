const Profile = ({ currentUser }) => {
    return (
        <div>
            <div className="container-fluid min-vh-100 d-flex flex-column">
                {/* Main Content */}
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    {currentUser ? (
                        <div className="text-center">
                            <h2>Welcome 🎉</h2>
                            <div className="mt-4 text-start">
                                <p>
                                    <strong>Email:</strong> {currentUser.email}
                                </p>
                                <p>
                                    <strong>Role:</strong> {currentUser.role}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2>Access Denied 🚫</h2>
                            <p>You are not authorized to access this page.</p>
                            <a href="/auth/signin" className="btn btn-danger">
                                Sign In
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile