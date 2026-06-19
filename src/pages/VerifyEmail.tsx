import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
    const { t, i18n } = useTranslation();
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const { api } = useApp();
    const calledRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage(t("auth.verify.noToken"));
            return;
        }

        if (calledRef.current) return;
        calledRef.current = true;

        const verify = async () => {
            try {
                const { data } = await api.get(`/api/auth/verify-email/${token}`);
                setStatus("success");
                setMessage(data.message);
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || t("auth.verify.failedAlert"));
            }
        };

        verify();
    }, [token, api]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
                
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-foreground">{t("auth.verify.loadingTitle")}</h2>
                        <p className="text-muted-foreground mt-2 text-sm">{t("auth.verify.loadingDesc")}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <CheckCircle2 size={56} className="text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-foreground">{t("auth.verify.successTitle")}</h2>
                        <p className="text-muted-foreground mt-2 text-sm px-4">{message}</p>
                        <Link 
                            to="/login" 
                            className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ color: "var(--background)" }}
                        >
                            {t("auth.verify.continueBtn")} {i18n.language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <XCircle size={56} className="text-danger mb-4" />
                        <h2 className="text-2xl font-bold text-foreground">{t("auth.verify.failTitle")}</h2>
                        <p className="text-muted-foreground mt-2 text-sm px-4">{message}</p>
                        <Link 
                            to="/login" 
                            className="mt-8 bg-muted text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-muted/80 transition-opacity"
                        >
                            {t("auth.verify.backBtn")}
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
