import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Report from "./pages/Report";
import History from "./pages/History";
import RankTracker from "./pages/RankTracker";
import RankDetail from "./pages/RankDetail";
import Competitors from "./pages/Competitors";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/AppContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function App() {
    const { user } = useApp();
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const hideNavbar = ["/login", "/register", "/forgot-password"].includes(location.pathname) || location.pathname.startsWith("/reset-password") || location.pathname.startsWith("/verify-email") || location.pathname.startsWith("/admin");

    return (
        <ErrorBoundary>
            <div className="mesh-bg"></div>
            <Toaster />
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={user ? <Navigate to='/dashboard' /> : <Login state="login" />} />
                <Route path="/register" element={user ? <Navigate to='/dashboard' /> : <Login state="register" />} />
                <Route path="/forgot-password" element={user ? <Navigate to='/dashboard' /> : <ForgotPassword />} />
                <Route path="/reset-password/:token" element={user ? <Navigate to='/dashboard' /> : <ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analyze" element={<Analyze />} />
                    <Route path="/report/:id" element={<Report />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/rank-tracker" element={<RankTracker />} />
                    <Route path="/rank/:id" element={<RankDetail />} />
                    <Route path="/competitors" element={<Competitors />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                {/* Admin Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
                    <Route path="/admin/users" element={user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/dashboard" />} />
                </Route>
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    );
}
