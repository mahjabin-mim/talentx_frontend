import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";
import { IAuthResponse } from "@/features/Authentications/Authentications.interface";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

const refreshClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (
            !originalRequest ||
            originalRequest._retry ||
            error.response?.status !== 401
        ) {
            return Promise.reject(error);
        }

        const state = useAuthStore.getState();
        if (!state.userId || !state.refreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshResponse = await refreshClient.post("/auth/refresh", {
                userId: state.userId,
                refreshToken: state.refreshToken,
            });

            const data = refreshResponse.data as IAuthResponse;

            useAuthStore.getState().setAuthTokens(data);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().reset();
            if (typeof window !== "undefined") {
                window.localStorage.removeItem("talentx-auth-flow");
            }

            return Promise.reject(refreshError);
        }
    },
);

export default api;
