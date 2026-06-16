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
            const { data } = await api.get('/api/auth/user')
            if (data.success) {
                setUser(data.user);
            }

        } catch (error) {
            localStorage.removeItem('token');
            settoken(null);
            setUser(null);


        }
        setloading(false);

    }

    useEffect(() => {
        loadUser();
    }, [])

    const login = async ()=>{

    }

    const register = async ()=>{
        
    }

    const logout = async ()=>{
        
    }



    const value = { user, token, loading, api, login, register, logout }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

};

export function useApp() {
    const context = useContext(AppContext);

    if (!context) throw new Error("useApp must be used within AppProvider");

    return context;
}