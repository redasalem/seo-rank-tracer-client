import { SearchIcon, ArrowRightIcon, Zap, Brain, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeWave } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const [url, setUrl] = useState("");
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const handleQuickAnalyze = (e: React.SubmitEvent) => {
        e.preventDefault();
        navigate(`/analyze?url=${encodeURIComponent(url)}`);
    };

    return (
        <section className="relative w-full px-4 pt-40 pb-32 sm:pt-44 min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="max-w-3xl mx-auto text-center relative z-10">
            
            <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
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
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 text-foreground tracking-tight"
            >
                {t("hero.title1")} <br className="hidden sm:block"/> <span className={`gradient-text ${i18n.language === 'en' ? 'dm-serif' : 'font-bold'}`}>{t("hero.title2")}</span>
            </motion.h1>

            <motion.p 
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
                {t("hero.subtitle")}
            </motion.p>

            {/* URL Input Bar */}
            <motion.form 
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleQuickAnalyze} 
                className="max-w-2xl mx-auto relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass-strong rounded-full px-2 py-2 flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4">
                        <SearchIcon size={18} className="text-primary shrink-0" />
                        <label htmlFor="hero-url-input" className="sr-only">{t("hero.placeholder")}</label>
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("hero.placeholder")} className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-2 font-medium" id="hero-url-input" />
                    </div>

                    <button type="submit" className="bg-primary px-6 py-3 rounded-full text-primary-foreground font-semibold text-sm hover:scale-105 transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-primary/20" id="hero-analyze-btn" style={{ color: "var(--background)" }}>
                        {t("hero.analyzeBtn")}
                        <ArrowRightIcon size={14} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                    </button>
                </div>
            </motion.form>

            <motion.p 
                initial={shouldReduce ? {} : { opacity: 0 }}
                animate={shouldReduce ? {} : { opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-muted-foreground text-sm mt-6 font-medium"
            >
                {t("hero.disclaimer")}
            </motion.p>
            </div>

            {/* Why RankBoost */}
            <motion.div 
                initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="w-full max-w-6xl mx-auto mt-20 relative z-10"
            >
                <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Rank Updates */}
                    <li className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <Zap size={24} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{t("hero.feature1_title", "Daily Rank Updates")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature1_desc", "Your keyword positions updated every day automatically. Track your progress over time with historical charts.")}</p>
                        </div>
                    </li>

                    {/* AI-Powered Insights */}
                    <li className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <Brain size={24} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{t("hero.feature2_title", "AI-Powered Insights")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature2_desc", "Get personalized SEO recommendations powered by Google Gemini AI. Ask questions, get actionable answers.")}</p>
                        </div>
                    </li>

                    {/* Arabic & English */}
                    <li className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <Globe size={24} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{t("hero.feature3_title", "Arabic & English Support")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature3_desc", "Full RTL support and bilingual interface built for the MENA market. Reports available in both languages.")}</p>
                        </div>
                    </li>
                </ul>
            </motion.div>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1">
                <HomeWave />
            </div>
        </section>
    );
}
