import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/AppContext";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga4";

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const CompleteRegistration = lazy(() => import("./pages/CompleteRegistration"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analyze = lazy(() => import("./pages/Analyze"));
const Report = lazy(() => import("./pages/Report"));
const History = lazy(() => import("./pages/History"));
const RankTracker = lazy(() => import("./pages/RankTracker"));
const RankDetail = lazy(() => import("./pages/RankDetail"));
const Competitors = lazy(() => import("./pages/Competitors"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminUserDetail = lazy(() => import("./pages/admin/AdminUserDetail"));
const AdminAnalyses = lazy(() => import("./pages/admin/AdminAnalyses"));
const AdminKeywords = lazy(() => import("./pages/admin/AdminKeywords"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAuditLog = lazy(() => import("./pages/admin/AdminAuditLog"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

export default function App() {
    const { user } = useApp();
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    useEffect(() => {
        if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
            ReactGA.send({ 
                hitType: "pageview", 
                page: location.pathname 
            });
        }
    }, [location]);

    const hideNavbar = ["/login", "/register", "/forgot-password"].includes(location.pathname) || location.pathname.startsWith("/reset-password") || location.pathname.startsWith("/verify-email") || location.pathname.startsWith("/register/complete") || location.pathname.startsWith("/admin");

    return (
        <ErrorBoundary>
            <div className="mesh-bg"></div>
            <Toaster />
            {!hideNavbar && <Navbar />}
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={user ? <Navigate to='/dashboard' /> : <Login state="login" />} />
                    <Route path="/register" element={user ? <Navigate to='/dashboard' /> : <Login state="register" />} />
                    <Route path="/register/complete" element={user ? <Navigate to='/dashboard' /> : <CompleteRegistration />} />
                    <Route path="/forgot-password" element={user ? <Navigate to='/dashboard' /> : <ForgotPassword />} />
                    <Route path="/reset-password/:token" element={user ? <Navigate to='/dashboard' /> : <ResetPassword />} />
                    <Route path="/verify-email/:token" element={user ? <Navigate to='/dashboard' /> : <VerifyEmail />} />
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
                    <Route element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
                            <Route path="/admin/analyses" element={<AdminAnalyses />} />
                            <Route path="/admin/keywords" element={<AdminKeywords />} />
                            <Route path="/admin/notifications" element={<AdminNotifications />} />
                            <Route path="/admin/settings" element={<AdminSettings />} />
                            <Route path="/admin/activity" element={<AdminAuditLog />} />
                        </Route>
                    </Route>
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}
