import axios from "axios";
import { isTokenValid } from "../utils/authUtils";

const API_BASE_URL = "https://localhost:7119/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");

    if (token) {
        if (!isTokenValid(token)) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
        }

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;