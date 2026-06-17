import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import axios from 'axios';


interface User {
    id: string;
    name: string;
    email: string;
    plan: string;
    analysisCount?: number;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    api: AxiosInstance;
    login: (email: string, password: string) => Promise<{ success: boolean, message?: string }>
    register: (name: string, email: string, password: string) => Promise<{ success: boolean, message?: string }>
    logout: () => void;
    addKeyword: (keyword: string, url: string, country: string) => Promise<{ success: boolean, message?: string }>;
    getKeywords: () => Promise<{ success: boolean, data?: any[], message?: string }>;
    deleteKeyword: (id: string) => Promise<{ success: boolean, message?: string }>;
    toggleKeyword: (id: string) => Promise<{ success: boolean, message?: string, active?: boolean }>;
    refreshKeyword: (id: string) => Promise<{ success: boolean, message?: string }>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AddProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, settoken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setloading] = useState(true);

    //axios instance with auth header
    const api = axios.create({
        baseURL: BACKEND_URL
    });

    //UPDATE axios header when token changes
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    });

    const loadUser = async () => {
        if (!token) {
            setloading(false);
            return;
        }
        try {
            const { data } = await api.get('/api/auth/getCurrentUser');
            if (data && data.user) {
                setUser({
                    id: data.user.id || data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    plan: data.user.plan,
                    analysisCount: data.user.analysisCount
                });
            }
        } catch (error) {
            localStorage.removeItem('token');
            settoken(null);
            setUser(null);
        }
        setloading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                settoken(data.token);
                if (data.user) {
                    setUser({
                        id: data.user.id || data.user._id,
                        name: data.user.name,
                        email: data.user.email,
                        plan: data.user.plan,
                        analysisCount: data.user.analysisCount
                    });
                }
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message || "Failed to login" };
        } catch (error: any) {
            const msg = error.response?.data?.message || "An error occurred during login";
            return { success: false, message: msg };
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                settoken(data.token);
                if (data.user) {
                    setUser({
                        id: data.user.id || data.user._id,
                        name: data.user.name,
                        email: data.user.email,
                        plan: data.user.plan,
                        analysisCount: data.user.analysisCount
                    });
                }
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message || "Failed to register" };
        } catch (error: any) {
            const msg = error.response?.data?.message || "An error occurred during registration";
            return { success: false, message: msg };
        }
    };

    const addKeyword = async (keyword: string, url: string, country: string) => {
        try {
            const { data } = await api.post('/api/rank/add', { keyword, url, country });
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to add keyword" };
        }
    };

    const getKeywords = async () => {
        try {
            const { data } = await api.get('/api/rank');
            return { success: true, data: data.keywords };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch keywords" };
        }
    };

    const deleteKeyword = async (id: string) => {
        try {
            const { data } = await api.delete(`/api/rank/${id}`);
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to delete keyword" };
        }
    };

    const toggleKeyword = async (id: string) => {
        try {
            const { data } = await api.put(`/api/rank/${id}/toggle`);
            return { success: true, message: data.message, active: data.active };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to toggle keyword" };
        }
    };

    const refreshKeyword = async (id: string) => {
        try {
            const { data } = await api.post(`/api/rank/${id}/refresh`);
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to refresh keyword" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        settoken(null);
        setUser(null);
        api.post('/api/auth/logout').catch(err => {
            console.error("Logout backend request failed:", err);
        });
    };

    const value = { user, token, loading, api, login, register, logout, addKeyword, getKeywords, deleteKeyword, toggleKeyword, refreshKeyword };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

};

export function useApp() {
    const context = useContext(AppContext);

    if (!context) throw new Error("useApp must be used within AppProvider");

    return context;
}