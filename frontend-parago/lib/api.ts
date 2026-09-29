import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.url?.includes("/api/v1")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Only redirect to login on 401 if user is already authenticated (has token)
        // Don't redirect during login attempts since that would cause infinite loops or 404
        const isLoginAttempt = error.config?.url?.includes("/auth/login");
        const hasToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        if (error.response?.status === 401 && !isLoginAttempt && hasToken) {
            // Clear token and redirect only if user is already logged in
            localStorage.removeItem("token");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_role");
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);
