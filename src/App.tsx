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
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";

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
            <Toaster 
                position="top-center"
                toastOptions={{
                    className: "!bg-card !text-foreground !border !border-border !shadow-2xl !backdrop-blur-xl !rounded-2xl !px-4 !py-3 !text-sm font-medium",
                    duration: 4000,
                    success: {
                        iconTheme: {
                            primary: "var(--success)",
                            secondary: "white",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "var(--danger)",
                            secondary: "white",
                        },
                    },
                }}
            />
            {!hideNavbar && <Navbar />}
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/login" element={user ? <Navigate to='/dashboard' /> : <PageTransition><Login state="login" /></PageTransition>} />
                    <Route path="/register" element={user ? <Navigate to='/dashboard' /> : <PageTransition><Login state="register" /></PageTransition>} />
                    <Route path="/register/complete" element={user ? <Navigate to='/dashboard' /> : <PageTransition><CompleteRegistration /></PageTransition>} />
                    <Route path="/forgot-password" element={user ? <Navigate to='/dashboard' /> : <PageTransition><ForgotPassword /></PageTransition>} />
                    <Route path="/reset-password/:token" element={user ? <Navigate to='/dashboard' /> : <PageTransition><ResetPassword /></PageTransition>} />
                    <Route path="/verify-email/:token" element={user ? <Navigate to='/dashboard' /> : <PageTransition><VerifyEmail /></PageTransition>} />
                    <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                    <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                        <Route path="/analyze" element={<PageTransition><Analyze /></PageTransition>} />
                        <Route path="/report/:id" element={<PageTransition><Report /></PageTransition>} />
                        <Route path="/history" element={<PageTransition><History /></PageTransition>} />
                        <Route path="/rank-tracker" element={<PageTransition><RankTracker /></PageTransition>} />
                        <Route path="/rank/:id" element={<PageTransition><RankDetail /></PageTransition>} />
                        <Route path="/competitors" element={<PageTransition><Competitors /></PageTransition>} />
                        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
                    </Route>
                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
                            <Route path="/admin/users" element={<PageTransition><AdminUsers /></PageTransition>} />
                            <Route path="/admin/users/:id" element={<PageTransition><AdminUserDetail /></PageTransition>} />
                            <Route path="/admin/analyses" element={<PageTransition><AdminAnalyses /></PageTransition>} />
                            <Route path="/admin/keywords" element={<PageTransition><AdminKeywords /></PageTransition>} />
                            <Route path="/admin/notifications" element={<PageTransition><AdminNotifications /></PageTransition>} />
                            <Route path="/admin/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
                            <Route path="/admin/activity" element={<PageTransition><AdminAuditLog /></PageTransition>} />
                        </Route>
                    </Route>
                    {/* 404 Route */}
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
            </AnimatePresence>
            </Suspense>
        </ErrorBoundary>
    );
}
