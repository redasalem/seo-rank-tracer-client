import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeWave } from "../../assets/assets";
import { useTranslation } from "react-i18next";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    const handleQuickAnalyze = (e: React.SubmitEvent) => {
        e.preventDefault();
        navigate(`/analyze?url=${encodeURIComponent(url)}`);
    };

    return (
        <section className="max-w-2xl mx-auto px-4 py-40 sm:py-44 min-h-screen text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/2 rounded-full text-xs text-primary mb-6 border border-primary/10">
                <div className="relative flex items-center justify-center">
                    <div className="absolute bg-blue-600 size-2 rounded-full animate-ping"></div>
                    <div className="bg-blue-600 size-1.5 rounded-full"></div>
                </div>
                {t("hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-tight mb-6 text-foreground">
                {t("hero.title1")} <span className={`gradient-text ${i18n.language === 'en' ? 'dm-serif' : 'font-bold'}`}>{t("hero.title2")}</span>
            </h1>
            <p className="text-sm  text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">{t("hero.subtitle")}</p>

            {/* URL Input Bar */}
            <form onSubmit={handleQuickAnalyze} className="max-w-2xl mx-auto relative">
                <div className="bg-card border border-border rounded-full px-2 py-1.5 flex items-center gap-2 animate-pulse-glow">
                    <div className="flex items-center gap-2 flex-1 px-3">
                        <SearchIcon size={16} className="text-muted-foreground shrink-0" />
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("hero.placeholder")} className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-2" id="hero-url-input" />
                    </div>

                    <button type="submit" className="bg-primary px-5 py-2.5 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2" id="hero-analyze-btn" style={{ color: "var(--background)" }}>
                        {t("hero.analyzeBtn")}
                        <ArrowRightIcon size={14} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                    </button>
                </div>
            </form>

            <p className="text-muted-foreground text-sm mt-6 ">{t("hero.disclaimer")}</p>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1">
                <HomeWave />
            </div>
        </section>
    );
}
