import { Outlet, Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Loader2 } from "lucide-react";

export default function AdminRoute() {
    const { user, token, loading } = useApp();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-accent animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse tracking-widest uppercase">
                    Loading...
                </p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
