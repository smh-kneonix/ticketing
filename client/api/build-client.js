import axios from "axios";

export default ({ req }) => {
    if (typeof window === "undefined") {
        // send request from server
        return axios.create({
            baseURL:
                "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers,
        });
    } else {
        // send request from browser
        return axios.create({
            baseURL: "/",
            withCredentials: true,
        });
    }
};
