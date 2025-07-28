import { useError } from "../contexts/ErrorContext";

export default function Error() {
    const { errors, setErrors } = useError();

    if (errors.length === 0) return null; // Don't show anything if no errors

    return (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
            {errors.map((error, i) => (
                <div
                    key={i}
                    className="toast show align-items-center text-white bg-danger border-0 mb-2"
                    role="alert"
                >
                    <div className="d-flex">
                        <div className="toast-body">{error.message}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            onClick={() => setErrors(errors.filter((_, index) => index !== i))}
                        ></button>
                    </div>
                </div>
            ))}
        </div>
    );
}
