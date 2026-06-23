import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader2, ChartNoAxesColumnIcon, User2Icon, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

type AuthFormValues = { name?: string; email: string; password: string };

export default function Login({ state }: { state: string }) {
    const { t } = useTranslation();
    const [isLoginState, setIsLoginState] = useState(state === "login");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, register } = useApp();

    const authSchema = useMemo(() => z.object({
        name: z.string().optional(),
        email: z.string().min(1, t("settings.validation.emailInvalid")).email(t("settings.validation.emailInvalid")),
        password: z.string().min(6, t("settings.validation.newMin")),
    }), [t]);

    const {
        register: registerForm,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        clearErrors
    } = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: { name: "", email: "", password: "" }
    });

    // Clear validation errors when switching states
    useEffect(() => {
        clearErrors();
    }, [isLoginState, clearErrors]);

    const onSubmit = async (data: AuthFormValues) => {
        if (!isLoginState && (!data.name || data.name.length < 2)) {
            setError("name", { type: "manual", message: t("settings.validation.nameMin") });
            return;
        }

        setLoading(true);

        try {
            if (isLoginState) {
                const res = await login(data.email, data.password);
                if (res.success) {
                    toast.success(t("auth.login.success"));
                } else {
                    toast.error(res.message || t("auth.login.failed"));
                }
            } else {
                const res = await register(data.name || "", data.email, data.password);
                if (res.success) {
                    toast.success(t("auth.login.regSuccess"));
                    setIsLoginState(true);
                    reset({ name: "", email: data.email, password: "" });
                } else {
                    toast.error(res.message || t("auth.login.regFailed"));
                }
            }
        } catch (err: any) {
            toast.error(t("auth.login.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center gap-2 group mb-10">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <ChartNoAxesColumnIcon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">RankBoost</span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="text-center py-5">
                            <h1 className="text-2xl font-bold text-foreground">{t("auth.login.title")}</h1>
                            <p className="text-muted-foreground text-sm mt-1">{isLoginState ? t("auth.login.subtitleSignIn") : t("auth.login.subtitleCreate")}</p>
                        </div>

                        {!isLoginState && (
                            <div>
                                <div className="block text-sm font-medium text-foreground mb-1.5">{t("auth.login.nameLabel")}</div>
                                <div className="relative">
                                    <User2Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder={t("auth.login.namePlaceholder")}
                                        className={`w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border ${errors.name ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} text-foreground placeholder-muted-foreground outline-none transition-colors text-sm`}
                                        {...registerForm("name")}
                                    />
                                </div>
                                {errors.name && <p className="text-danger text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                            </div>
                        )}
                        
                        <div>
                            <div className="block text-sm font-medium text-foreground mb-1.5 mt-4">{t("auth.login.emailLabel")}</div>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder={t("auth.login.emailPlaceholder")}
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border ${errors.email ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} text-foreground placeholder-muted-foreground outline-none transition-colors text-sm`}
                                    {...registerForm("email")}
                                />
                            </div>
                            {errors.email && <p className="text-danger text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 mt-4">
                                <span className="block text-sm font-medium text-foreground">{t("auth.login.passwordLabel")}</span>
                                {isLoginState && (
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                                        {t("auth.login.forgotBtn")}
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("auth.login.passwordPlaceholder")}
                                    className={`w-full pl-11 pr-11 py-3 rounded-lg bg-muted/60 border ${errors.password ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} text-foreground placeholder-muted-foreground outline-none transition-colors text-sm`}
                                    {...registerForm("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-danger text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            id="login-submit-btn"
                            style={{ color: "var(--background)" }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : isLoginState ? t("auth.login.signInBtn") : t("auth.login.createBtn")}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    {isLoginState ? t("auth.login.noAccount") : t("auth.login.hasAccount")}
                    <button onClick={() => setIsLoginState((prev) => !prev)} className="text-primary hover:underline font-medium pl-1">
                        {isLoginState ? t("auth.login.signUp") : t("auth.login.signIn")}
                    </button>
                </p>
            </div>
        </div>
    );
}
