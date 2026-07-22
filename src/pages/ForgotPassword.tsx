import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ChartNoAxesColumnIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { api } = useApp();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post("/api/auth/forgot-password", { email });
            toast.success(data.message || t("auth.forgot.success"));
            setSubmitted(true);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || t("auth.login.error"));
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
                    {submitted ? (
                        <div className="text-center py-5 space-y-4">
                            <h1 className="text-2xl text-foreground font-semibold">{t("auth.forgot.checkEmailTitle")}</h1>
                            <p className="text-muted-foreground text-sm">
                                {t("auth.forgot.checkEmailDesc")} <strong className="text-foreground">{email}</strong>.
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {t("auth.forgot.spamHint")}
                            </p>
                            <div className="pt-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                                >
                                    {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t("auth.forgot.backToSignIn")}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="text-center py-5">
                                <h1 className="text-2xl text-foreground font-semibold">{t("auth.forgot.title")}</h1>
                                <p className="text-muted-foreground text-sm mt-1">
                                    {t("auth.forgot.desc")}
                                </p>
                            </div>

                            <label className="block">
                                <div className="block text-sm text-foreground mb-1.5">{t("auth.forgot.emailLabel")}</div>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("auth.login.emailPlaceholder")}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-5 rounded-lg bg-primary text-sm text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ color: "var(--background)" }}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : t("auth.forgot.sendBtn")}
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
