import { createContext, useContext, useEffect, useState, type ReactNode, useMemo } from 'react';
import type { AxiosInstance } from 'axios';
import axios from 'axios';


interface User {
    id: string;
    name: string;
    email: string;
    plan: string;
    role?: string;
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
    addKeyword: (data: any) => Promise<{ success: boolean; message?: string; tracking?: any }>;
    getKeywords: (params?: { page?: number, limit?: number, search?: string, status?: string, sortBy?: string }) => Promise<{ success: boolean; data?: any[]; totalPages?: number; total?: number; page?: number; message?: string }>;
    getDashboardStats: () => Promise<{ success: boolean; data?: any; message?: string }>;
    deleteKeyword: (id: string) => Promise<{ success: boolean; message?: string }>;
    toggleKeyword: (id: string) => Promise<{ success: boolean; message?: string, active?: boolean }>;
    refreshKeyword: (id: string) => Promise<{ success: boolean; message?: string }>;
    startAnalysis: (url: string) => Promise<{ success: boolean; message?: string; analysisId?: string }>;
    getAnalysis: (id: string) => Promise<{ success: boolean; data?: any; message?: string }>;
    getAnalysisHistory: (params?: { page?: number, limit?: number }) => Promise<{ success: boolean; data?: any[]; totalPages?: number; total?: number; page?: number; message?: string }>;
    updateProfile: (name: string, email: string) => Promise<{ success: boolean; message?: string }>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
    getNotifications: () => Promise<{ success: boolean; data?: any[] }>;
    markNotificationAsRead: (id: string) => Promise<{ success: boolean }>;
    markAllNotificationsAsRead: () => Promise<{ success: boolean }>;
    createCheckoutSession: () => Promise<{ success: boolean; url?: string; message?: string }>;
    getGlobalCompetitors: () => Promise<{ success: boolean; data?: any; message?: string }>;
    loadUser: () => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AddProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, settoken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setloading] = useState(true);

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: BACKEND_URL,
            withCredentials: true
        });

        //UPDATE axios header when token changes
        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        });

        instance.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            // If 401 Unauthorized and we haven't retried yet (and it's not a login attempt)
            if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/login') {
                originalRequest._retry = true;
                try {
                    // Try to refresh the token using the HttpOnly cookie
                    const { data } = await axios.get(`${BACKEND_URL}/api/auth/refresh`, { withCredentials: true });
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                        settoken(data.token);
                        // Update header for original request and retry it
                        originalRequest.headers.Authorization = `Bearer ${data.token}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh token expired or missing
                    localStorage.removeItem("token");
                    settoken(null);
                    setUser(null);
                }
            }
            return Promise.reject(error);
        });

        return instance;
    }, []); // Empty dependency array as settoken and setUser are stable functions

    const loadUser = async () => {
        let currentToken = token;
        
        // Attempt silent login via refresh token if no access token exists
        if (!currentToken) {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/auth/refresh`, { withCredentials: true });
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    settoken(data.token);
                    currentToken = data.token;
                    if (data.user) {
                        setUser({
                            id: data.user.id || data.user._id,
                            name: data.user.name,
                            email: data.user.email,
                            plan: data.user.plan,
                            role: data.user.role,
                            analysisCount: data.user.analysisCount
                        });
                    }
                }
            } catch (error) {
                // No valid refresh cookie, user is not logged in
            }
            
            if (!currentToken) {
                setloading(false);
                return;
            }
        }
        try {
            const { data } = await api.get('/api/auth/getCurrentUser');
            if (data && data.user) {
                setUser({
                    id: data.user.id || data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    plan: data.user.plan,
                    role: data.user.role,
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
                        role: data.user.role,
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
            return { success: true, message: data.message };
        } catch (error: any) {
            const msg = error.response?.data?.message || "An error occurred during registration";
            return { success: false, message: msg };
        }
    };

    const addKeyword = async (keywordData: any) => {
        try {
            const { data } = await api.post('/api/rank/add', keywordData);
            return { success: true, message: data.message, tracking: data.tracking };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to add keyword" };
        }
    };

    const getKeywords = async (params?: { page?: number, limit?: number, search?: string, status?: string, sortBy?: string }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                if (params.search) queryParams.append('search', params.search);
                if (params.status && params.status !== 'all') queryParams.append('status', params.status);
                if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            }
            
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const { data } = await api.get(`/api/rank${queryString}`);
            return { success: true, data: data.keywords, totalPages: data.totalPages, total: data.total, page: data.page };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch keywords" };
        }
    };

    const getDashboardStats = async () => {
        try {
            const { data } = await api.get('/api/rank/stats');
            return { success: true, data: data.stats };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch dashboard stats" };
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

    const startAnalysis = async (url: string) => {
        try {
            const { data } = await api.post("/api/analysis/start", { url });
            
            // Increment the user's local analysis count
            if (user && user.plan === "free") {
                setUser({
                    ...user,
                    analysisCount: (user.analysisCount || 0) + 1
                });
            }
            
            return { success: true, message: data.message, analysisId: data.analysisId };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to start analysis" };
        }
    };

    const getAnalysis = async (id: string) => {
        try {
            const { data } = await api.get(`/api/analysis/${id}`);
            return { success: true, data: data.analysis };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to get analysis report" };
        }
    };

    const getAnalysisHistory = async (params?: { page?: number, limit?: number }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
            }
            
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const { data } = await api.get(`/api/analysis${queryString}`);
            return { success: true, data: data.analyses, totalPages: data.totalPages, total: data.total, page: data.page };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch analysis history" };
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

    const updateProfile = async (name: string, email: string) => {
        try {
            const { data } = await api.put('/api/auth/profile', { name, email });
            if (data.user) {
                setUser({
                    id: data.user.id || data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    plan: data.user.plan,
                    role: data.user.role,
                    analysisCount: data.user.analysisCount
                });
            }
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to update profile" };
        }
    };

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const { data } = await api.put('/api/auth/password', { currentPassword, newPassword });
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to update password" };
        }
    };

    const getNotifications = async () => {
        try {
            const { data } = await api.get('/api/notifications');
            return { success: true, data: data.data };
        } catch (error: any) {
            return { success: false, message: "Failed to fetch notifications" };
        }
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            return { success: true };
        } catch (error: any) {
            return { success: false };
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await api.put('/api/notifications/read-all');
            return { success: true };
        } catch (error: any) {
            return { success: false };
        }
    };

    const createCheckoutSession = async () => {
        try {
            const { data } = await api.post('/api/subscription/create-checkout-session');
            return { success: true, url: data.url };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to create checkout session" };
        }
    };

    const getGlobalCompetitors = async () => {
        try {
            const { data } = await api.get('/api/rank/competitors');
            return { success: true, data: data.competitors };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch global competitors" };
        }
    };

    const value = { 
        user, 
        token, 
        loading, 
        api, 
        login, 
        register, 
        logout, 
        addKeyword, 
        getKeywords, 
        getDashboardStats,
        deleteKeyword, 
        toggleKeyword, 
        refreshKeyword,
        startAnalysis,
        getAnalysis,
        getAnalysisHistory,
        updateProfile,
        updatePassword,
        getNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createCheckoutSession,
        getGlobalCompetitors,
        loadUser
    };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

};

export function useApp() {
    const context = useContext(AppContext);

    if (!context) throw new Error("useApp must be used within AppProvider");

    return context;
}