import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeWave } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    const handleQuickAnalyze = (e: React.SubmitEvent) => {
        e.preventDefault();
        navigate(`/analyze?url=${encodeURIComponent(url)}`);
    };

    return (
        <section className="relative max-w-2xl mx-auto px-4 py-40 sm:py-44 min-h-screen text-center flex flex-col justify-center">
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full text-xs font-semibold text-primary mb-6 border border-primary/10 shadow-sm"
            >
                <div className="relative flex items-center justify-center">
                    <div className="absolute bg-blue-500 size-2 rounded-full animate-ping"></div>
                    <div className="bg-blue-500 size-1.5 rounded-full"></div>
                </div>
                {t("hero.badge")}
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 text-foreground tracking-tight"
            >
                {t("hero.title1")} <br className="hidden sm:block"/> <span className={`gradient-text ${i18n.language === 'en' ? 'dm-serif' : 'font-bold'}`}>{t("hero.title2")}</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
                {t("hero.subtitle")}
            </motion.p>

            {/* URL Input Bar */}
            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleQuickAnalyze} 
                className="max-w-2xl mx-auto relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass-strong rounded-full px-2 py-2 flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4">
                        <SearchIcon size={18} className="text-primary shrink-0" />
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("hero.placeholder")} className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-2 font-medium" id="hero-url-input" />
                    </div>

                    <button type="submit" className="bg-primary px-6 py-3 rounded-full text-primary-foreground font-semibold text-sm hover:scale-105 transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-primary/20" id="hero-analyze-btn" style={{ color: "var(--background)" }}>
                        {t("hero.analyzeBtn")}
                        <ArrowRightIcon size={14} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                    </button>
                </div>
            </motion.form>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-muted-foreground text-sm mt-6 font-medium"
            >
                {t("hero.disclaimer")}
            </motion.p>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1">
                <HomeWave />
            </div>
        </section>
    );
}
