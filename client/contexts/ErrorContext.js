import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const [errors, setErrors] = useState([]);

    return (
        <ErrorContext.Provider value={{ errors, setErrors }}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}
