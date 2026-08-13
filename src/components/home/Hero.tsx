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
            {/* Deep Space Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-float pointer-events-none -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-3xl mx-auto text-center relative z-10">
            
            <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 20, scale: 0.95 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-card/80 backdrop-blur-md rounded-full text-xs font-semibold text-accent mb-8 border border-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
                <div className="relative flex items-center justify-center">
                    <div className="absolute bg-accent size-2 rounded-full animate-ping"></div>
                    <div className="bg-accent size-1.5 rounded-full"></div>
                </div>
                {t("hero.badge")}
            </motion.div>

            <motion.h1 
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 text-foreground tracking-tight drop-shadow-lg"
            >
                {t("hero.title1")} <br className="hidden sm:block"/> <span className={`gradient-text drop-shadow-[0_0_25px_rgba(14,165,233,0.4)] ${i18n.language === 'en' ? 'dm-serif' : 'font-bold'}`}>{t("hero.title2")}</span>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
                <div className="relative glass-strong rounded-full px-2 py-2 flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4">
                        <SearchIcon size={18} className="text-accent shrink-0" />
                        <label htmlFor="hero-url-input" className="sr-only">{t("hero.placeholder")}</label>
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("hero.placeholder")} className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-2 font-medium" id="hero-url-input" />
                    </div>

                    <button type="submit" className="bg-primary hover:bg-white text-primary-foreground font-bold px-6 py-3 rounded-full text-sm transition-all shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105" id="hero-analyze-btn">
                        {t("hero.analyzeBtn")}
                        <ArrowRightIcon size={14} className={`text-primary-foreground ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </motion.form>

            <motion.p 
                initial={shouldReduce ? {} : { opacity: 0 }}
                animate={shouldReduce ? {} : { opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-muted-foreground/60 text-sm mt-6 font-medium"
            >
                {t("hero.disclaimer")}
            </motion.p>
            </div>

            {/* Why RankBoost */}
            <motion.div 
                initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="w-full max-w-6xl mx-auto mt-24 relative z-10"
            >
                <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Rank Updates */}
                    <li className="glass p-6 text-left relative group overflow-hidden hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Zap size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature1_title", "Daily Rank Updates")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature1_desc", "Your keyword positions updated every day automatically. Track your progress over time with historical charts.")}</p>
                        </div>
                    </li>

                    {/* AI-Powered Insights */}
                    <li className="glass p-6 text-left relative group overflow-hidden hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Brain size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature2_title", "AI-Powered Insights")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature2_desc", "Get personalized SEO recommendations powered by Google Gemini AI. Ask questions, get actionable answers.")}</p>
                        </div>
                    </li>

                    {/* Arabic & English */}
                    <li className="glass p-6 text-left relative group overflow-hidden hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Globe size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature3_title", "Arabic & English Support")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature3_desc", "Full RTL support and bilingual interface built for the MENA market. Reports available in both languages.")}</p>
                        </div>
                    </li>
                </ul>
            </motion.div>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1 opacity-50 mix-blend-overlay">
                <HomeWave />
            </div>
        </section>
    );
}
