import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, CreditCard, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

type ProfileFormValues = { name: string; email: string };
type PasswordFormValues = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function Settings() {
    const { t } = useTranslation();
    const { user, updateProfile, updatePassword, createCheckoutSession, api, loadUser } = useApp();
    const [activeTab, setActiveTab] = useState("profile");
    const location = useLocation();

    const profileSchema = useMemo(() => z.object({
        name: z.string().min(2, t("settings.validation.nameMin")).max(50, t("settings.validation.nameMax")),
        email: z.string().email(t("settings.validation.emailInvalid")),
    }), [t]);

    const passwordSchema = useMemo(() => z.object({
        currentPassword: z.string().min(1, t("settings.validation.currentReq")),
        newPassword: z.string().min(6, t("settings.validation.newMin")),
        confirmPassword: z.string().min(1, t("settings.validation.confirmReq")),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t("settings.validation.passMismatch"),
        path: ["confirmPassword"],
    }), [t]);

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isSubmitting: isSavingProfile },
        reset: resetProfile
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", email: "" }
    });

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
        reset: resetPassword
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });
    
    // Checkout State
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // Password Visibility State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            resetProfile({ name: user.name, email: user.email });
        }
    }, [user, resetProfile]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tab = query.get("tab");
        if (tab && ["profile", "password", "subscription"].includes(tab)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab(tab);
        }

        if (query.get("success")) {
            toast.success(t("settings.alerts.subSuccess"));
            window.history.replaceState({}, document.title, window.location.pathname);
            setActiveTab("subscription");
            loadUser(); // Re-fetch user data to reflect new plan
        }
        if (query.get("canceled")) {
            toast.error(t("settings.alerts.subCanceled"));
            window.history.replaceState({}, document.title, window.location.pathname);
            setActiveTab("subscription");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        const res = await updateProfile(data.name, data.email);
        if (res.success) {
            toast.success(res.message || t("settings.alerts.profileSuccess"));
        } else {
            toast.error(res.message || t("settings.alerts.profileFailed"));
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        const res = await updatePassword(data.currentPassword, data.newPassword);
        if (res.success) {
            toast.success(res.message || t("settings.alerts.passwordSuccess"));
            resetPassword();
        } else {
            toast.error(res.message || t("settings.alerts.passwordFailed"));
        }
    };

    const handleUpgrade = async () => {
        setIsRedirecting(true);
        const toastId = toast.loading("Redirecting to checkout...");
        const res = await createCheckoutSession();
        if (res.success && res.url) {
            toast.success("Redirecting...", { id: toastId });
            window.location.href = res.url;
        } else {
            toast.error(res.message || t("settings.alerts.paymentFailed"), { id: toastId });
            setIsRedirecting(false);
        }
    };

    const handleManageSubscription = async () => {
        setIsRedirecting(true);
        const toastId = toast.loading("Redirecting...");
        try {
            const { data } = await api.post('/api/subscription/create-portal-session');
            if (data.success && data.url) {
                toast.success("Redirecting...", { id: toastId });
                window.location.href = data.url;
            } else {
                toast.error(data.message || t("settings.alerts.paymentFailed"), { id: toastId });
                setIsRedirecting(false);
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || t("settings.alerts.paymentFailed"), { id: toastId });
            setIsRedirecting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) return toast.error("Password is required");
        setIsDeleting(true);
        const toastId = toast.loading("Deleting account...");
        try {
            const { data } = await api.delete('/api/auth/account', { data: { password: deletePassword } });
            toast.success(data.message || "Account deleted successfully", { id: toastId });
            await api.post("/api/auth/logout");
            window.location.href = "/";
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Failed to delete account", { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0">
                <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2 shadow-sm">
                    <button 
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "profile" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                        <User size={18} />
                        {t("settings.tabs.profile")}
                    </button>
                    <button 
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "password" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                        <Lock size={18} />
                        {t("settings.tabs.security")}
                    </button>
                    <button 
                        onClick={() => setActiveTab("subscription")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "subscription" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                        <CreditCard size={18} />
                        {t("settings.tabs.subscription")}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground">{t("settings.profile.title")}</h2>
                            <p className="text-muted-foreground text-sm mt-1">{t("settings.profile.desc")}</p>
                        </div>

                        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5 max-w-xl">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.profile.nameLabel")}</label>
                                <input 
                                    type="text" 
                                    className={`w-full px-4 py-2.5 rounded-xl border ${profileErrors.name ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                    placeholder={t("settings.profile.namePlaceholder")}
                                    {...registerProfile("name")}
                                />
                                {profileErrors.name && <p className="text-danger text-xs mt-1.5 font-medium">{profileErrors.name.message}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.profile.emailLabel")}</label>
                                <input 
                                    type="email" 
                                    className={`w-full px-4 py-2.5 rounded-xl border ${profileErrors.email ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                    placeholder={t("settings.profile.emailPlaceholder")}
                                    {...registerProfile("email")}
                                />
                                {profileErrors.email && <p className="text-danger text-xs mt-1.5 font-medium">{profileErrors.email.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSavingProfile}
                                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                            >
                                {isSavingProfile ? (
                                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={18} />
                                )}
                                {t("settings.profile.saveBtn")}
                            </button>
                        </form>

                        <div className="mt-12 pt-6 border-t border-border">
                            <h3 className="text-xl font-bold text-danger mb-2">Danger Zone</h3>
                            <p className="text-muted-foreground text-sm mb-4">Permanently delete your account and all of your data. This action cannot be undone.</p>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-2.5 bg-danger/10 text-danger border border-danger/20 rounded-xl font-medium hover:bg-danger hover:text-white transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground">{t("settings.security.title")}</h2>
                            <p className="text-muted-foreground text-sm mt-1">{t("settings.security.desc")}</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5 max-w-xl">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.security.currentLabel")}</label>
                                <div className="relative">
                                    <input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        className={`w-full pl-4 pr-11 py-2.5 rounded-xl border ${passwordErrors.currentPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                        placeholder="••••••••"
                                        {...registerPassword("currentPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && <p className="text-danger text-xs mt-1.5 font-medium">{passwordErrors.currentPassword.message}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.security.newLabel")}</label>
                                <div className="relative">
                                    <input 
                                        type={showNewPassword ? "text" : "password"} 
                                        className={`w-full pl-4 pr-11 py-2.5 rounded-xl border ${passwordErrors.newPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                        placeholder="••••••••"
                                        {...registerPassword("newPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && <p className="text-danger text-xs mt-1.5 font-medium">{passwordErrors.newPassword.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.security.confirmLabel")}</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        className={`w-full pl-4 pr-11 py-2.5 rounded-xl border ${passwordErrors.confirmPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                        placeholder="••••••••"
                                        {...registerPassword("confirmPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && <p className="text-danger text-xs mt-1.5 font-medium">{passwordErrors.confirmPassword.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSavingPassword}
                                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                            >
                                {isSavingPassword ? (
                                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={18} />
                                )}
                                {t("settings.security.updateBtn")}
                            </button>
                        </form>
                    </div>
                )}

                {/* Subscription Tab */}
                {activeTab === "subscription" && (
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground">{t("settings.subscription.title")}</h2>
                            <p className="text-muted-foreground text-sm mt-1">{t("settings.subscription.desc")}</p>
                        </div>

                        <div className="bg-muted/30 border border-border rounded-xl p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-foreground capitalize">{t("settings.subscription.planName", { plan: user?.plan || "free" })}</h3>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-accent/20 text-accent border border-accent/20">
                                            {t("settings.subscription.active")}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {t("settings.subscription.currentPlanDesc", { plan: user?.plan || "free" })}
                                    </p>
                                </div>
                                {user?.plan !== "pro" && (
                                    <button 
                                        onClick={handleUpgrade}
                                        disabled={isRedirecting}
                                        className="px-5 py-2.5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                                    >
                                        {isRedirecting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                        {t("settings.subscription.upgradeBtn")}
                                    </button>
                                )}
                                {user?.plan === "pro" && (
                                    <button 
                                        onClick={handleManageSubscription}
                                        disabled={isRedirecting}
                                        className="px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-all flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {isRedirecting && <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>}
                                        {t("settings.subscription.manageBtn", { defaultValue: "Manage Subscription" })}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">{t("settings.subscription.planLimits")}</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-muted-foreground">{t("settings.subscription.dailyUsed")}</span>
                                        <span className="font-medium text-foreground">{user?.analysisCount || 0} / {user?.plan === "pro" ? t("settings.subscription.unlimited") : "10"}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${user?.plan === "pro" ? 100 : Math.min(((user?.analysisCount || 0) / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-muted-foreground">{t("settings.subscription.trackingLimit")}</span>
                                        <span className="font-medium text-foreground">{user?.plan === "pro" ? t("settings.subscription.unlimited") : t("settings.subscription.max10")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in">
                        <div className="flex items-center gap-3 text-danger mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold">Delete Account</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mb-6">
                            This action is permanent and cannot be undone. All your keywords, tracking history, and SEO reports will be permanently deleted.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                            <input 
                                type="password" 
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-danger bg-background/50 text-foreground focus:outline-none transition-all"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || !deletePassword}
                                className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-xl text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-70"
                            >
                                {isDeleting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
