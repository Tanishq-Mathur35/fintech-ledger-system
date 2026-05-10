import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authService = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
};

export const accountService = {
    create: () => api.post("/accounts"),
    getAll: () => api.get("/accounts"),
    getBalance: (accountId) => api.get(`/accounts/balance/${accountId}`),
};

export const transactionService = {
    create: (data) => api.post("/transactions", data),
    createInitialFunds: (data) =>
        api.post("/transactions/system/initial-funds", data),
};

export default api;
