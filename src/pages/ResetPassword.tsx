import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Loader2, ChartNoAxesColumnIcon, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
    const { t, i18n } = useTranslation();
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { api } = useApp();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error(t("auth.reset.passMin"));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t("auth.reset.passMismatch"));
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
            toast.success(data.message || t("auth.reset.successAlert"));
            setSuccess(true);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || t("auth.reset.invalidToken"));
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
                        <ChartNoAxesColumnIcon />
                        <span className="text-xl tracking-tight text-foreground">RankBoost</span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-border rounded-2xl p-8">
                    {success ? (
                        <div className="text-center py-5 space-y-4">
                            <div className="flex justify-center text-emerald-500">
                                <CheckCircle2 size={48} className="animate-bounce" />
                            </div>
                            <h1 className="text-2xl text-foreground font-semibold">{t("auth.reset.title")}</h1>
                            <p className="text-muted-foreground text-sm">
                                {t("auth.reset.successDesc")}
                            </p>
                            <p className="text-muted-foreground text-xs animate-pulse">
                                {t("auth.reset.redirecting")}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="text-center py-5">
                                <h1 className="text-2xl text-foreground font-semibold">{t("auth.reset.newTitle")}</h1>
                                <p className="text-muted-foreground text-sm mt-1">
                                    {t("auth.reset.newDesc")}
                                </p>
                            </div>

                            <label className="block">
                                <div className="block text-sm text-foreground mb-1.5">{t("auth.reset.newLabel")}</div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t("auth.reset.newPlaceholder")}
                                        className="w-full pl-11 pr-11 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </label>

                            <label className="block">
                                <div className="block text-sm text-foreground mb-1.5">{t("auth.reset.confirmLabel")}</div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t("auth.reset.confirmPlaceholder")}
                                        className="w-full pl-11 pr-11 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-5 rounded-lg bg-primary text-sm text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ color: "var(--background)" }}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : t("auth.reset.resetBtn")}
                            </button>

                            <div className="text-center pt-2">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                                >
                                    {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t("auth.forgot.backToSignIn")}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
