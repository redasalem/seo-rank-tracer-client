import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Loader2, ChartNoAxesColumnIcon, User2Icon, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

type CompleteFormValues = { name: string; password: string };

export default function CompleteRegistration() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { completeRegistration } = useApp();

    const completeSchema = z.object({
        name: z.string().min(3, t("settings.validation.nameMin") || "Name must be at least 3 characters long"),
        password: z.string().min(6, t("settings.validation.newMin") || "Password must be at least 6 characters long"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompleteFormValues>({
        resolver: zodResolver(completeSchema),
        defaultValues: { name: "", password: "" }
    });

    const onSubmit = async (data: CompleteFormValues) => {
        if (!token) {
            toast.error("Invalid or missing registration token.");
            return;
        }

        setLoading(true);
        try {
            const res = await completeRegistration(token, data.name, data.password);
            if (res.success) {
                toast.success(res.message || "Registration completed successfully!");
                navigate("/"); // Redirect to home/dashboard
            } else {
                toast.error(res.message || "Failed to complete registration.");
            }
        } catch {
            toast.error("An error occurred during registration completion");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
                    <h1 className="text-2xl font-bold text-danger mb-4">Invalid Link</h1>
                    <p className="text-muted-foreground mb-6">The registration link is invalid or missing the security token.</p>
                    <Link to="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium inline-block" style={{ color: "var(--background)" }}>
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-2xl font-bold text-foreground">Complete Registration</h1>
                            <p className="text-muted-foreground text-sm mt-1">Almost done! Please enter your name and choose a password.</p>
                        </div>

                        <div>
                            <div className="block text-sm font-medium text-foreground mb-1.5">{t("auth.login.nameLabel") || "Name"}</div>
                            <div className="relative">
                                <User2Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={t("auth.login.namePlaceholder") || "John Doe"}
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border ${errors.name ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} text-foreground placeholder-muted-foreground outline-none transition-colors text-sm`}
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && <p className="text-danger text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                        </div>

                        <div>
                            <div className="block text-sm font-medium text-foreground mb-1.5 mt-4">{t("auth.login.passwordLabel") || "Password"}</div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("auth.login.passwordPlaceholder") || "••••••••"}
                                    className={`w-full pl-11 pr-11 py-3 rounded-lg bg-muted/60 border ${errors.password ? 'border-danger focus:border-danger' : 'border-border focus:border-primary/50'} text-foreground placeholder-muted-foreground outline-none transition-colors text-sm`}
                                    {...register("password")}
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
                            style={{ color: "var(--background)" }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : "Complete & Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
