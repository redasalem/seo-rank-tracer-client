import { Link } from "react-router-dom";
import { Ghost, Home, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t, i18n } = useTranslation();
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="glass max-w-lg w-full p-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 blur-3xl rounded-full"></div>
                
                <div className="relative mb-8 z-10">
                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Ghost size={48} />
                    </div>
                </div>
                
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2 z-10">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-foreground mb-4 z-10">{t("notFound.title")}</h2>
                <p className="text-muted-foreground mb-8 max-w-sm z-10">
                    {t("notFound.desc")}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center z-10">
                    <button 
                        onClick={() => window.history.back()}
                        className="glass border border-border px-6 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                    >
                        {i18n.language === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                        {t("notFound.goBack")}
                    </button>
                    <Link 
                        to="/"
                        className="bg-primary px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{ color: "var(--background)" }}
                    >
                        <Home size={18} />
                        {t("notFound.home")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
