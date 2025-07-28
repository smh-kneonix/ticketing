import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

export default () => {
    const router = useRouter();

    const { doRequest } = useRequest();
    useEffect(() => {
        doRequest({
            url: "/api/users/signout",
            method: "post",
            body: {},
            onSuccess: () => router.push("/auth/signin"),
        });
    }, []);

    return <div>sign out in progress...</div>;
};
