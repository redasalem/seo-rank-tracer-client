import { Outlet, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
    const { token, loading } = useApp();
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-90">
                <div className="relative flex items-center justify-center">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    {/* Spinner */}
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-sm font-medium text-gray-400 animate-pulse tracking-widest uppercase">
                    Authenticating...
                </p>
            </div>
        )
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
