import axios from "axios";
import { useError } from "../contexts/ErrorContext";

export default function useRequest() {
    const { setErrors } = useError();

    const doRequest = async ({ url, method = "get", body = {}, onSuccess }) => {
        setErrors([]); // Clear errors on success
        try {
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            setErrors(
                err.response?.data?.errors || [{ message: "An unexpected error occurred" }]
            );
        }
    };

    return { doRequest };
}
