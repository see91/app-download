import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // if (error.response && error.response.status === 401) {
        //     if (typeof window !== "undefined") {
        //         window.location.href = "/login";
        //     }
        // }
        return Promise.reject(error);
    }
);

export default axiosInstance;
