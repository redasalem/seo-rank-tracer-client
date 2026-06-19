import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppConext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, CreditCard, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

type ProfileFormValues = { name: string; email: string };
type PasswordFormValues = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function Settings() {
    const { t } = useTranslation();
    const { user, updateProfile, updatePassword, createCheckoutSession } = useApp();
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

    useEffect(() => {
        if (user) {
            resetProfile({ name: user.name, email: user.email });
        }
    }, [user, resetProfile]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tab = query.get("tab");
        if (tab && ["profile", "password", "subscription"].includes(tab)) {
            setActiveTab(tab);
        }

        if (query.get("success")) {
            toast.success(t("settings.alerts.subSuccess"));
            window.history.replaceState({}, document.title, window.location.pathname);
            setActiveTab("subscription");
        }
        if (query.get("canceled")) {
            toast.error(t("settings.alerts.subCanceled"));
            window.history.replaceState({}, document.title, window.location.pathname);
            setActiveTab("subscription");
        }
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
        const res = await createCheckoutSession();
        if (res.success && res.url) {
            window.location.href = res.url;
        } else {
            toast.error(res.message || t("settings.alerts.paymentFailed"));
            setIsRedirecting(false);
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
                                <input 
                                    type="password" 
                                    className={`w-full px-4 py-2.5 rounded-xl border ${passwordErrors.currentPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                    placeholder="••••••••"
                                    {...registerPassword("currentPassword")}
                                />
                                {passwordErrors.currentPassword && <p className="text-danger text-xs mt-1.5 font-medium">{passwordErrors.currentPassword.message}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.security.newLabel")}</label>
                                <input 
                                    type="password" 
                                    className={`w-full px-4 py-2.5 rounded-xl border ${passwordErrors.newPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                    placeholder="••••••••"
                                    {...registerPassword("newPassword")}
                                />
                                {passwordErrors.newPassword && <p className="text-danger text-xs mt-1.5 font-medium">{passwordErrors.newPassword.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("settings.security.confirmLabel")}</label>
                                <input 
                                    type="password" 
                                    className={`w-full px-4 py-2.5 rounded-xl border ${passwordErrors.confirmPassword ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} bg-background/50 text-foreground focus:outline-none transition-all`}
                                    placeholder="••••••••"
                                    {...registerPassword("confirmPassword")}
                                />
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
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">{t("settings.subscription.planLimits")}</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-muted-foreground">{t("settings.subscription.dailyUsed")}</span>
                                        <span className="font-medium text-foreground">{user?.analysisCount || 0} / {user?.plan === "pro" ? t("settings.subscription.unlimited") : "3"}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${user?.plan === "pro" ? 100 : Math.min(((user?.analysisCount || 0) / 3) * 100, 100)}%` }}
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
        </div>
    );
}
