import { SearchIcon, ArrowRightIcon, Zap, Brain, Globe, Star, BarChart3, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HomeWave } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion, useInView } from "framer-motion";

// Animated counter hook
function useAnimatedCounter(end: number, duration = 2000, startOnView = true) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!startOnView || !inView) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, inView, startOnView]);

    return { count, ref };
}

// Particle effect component
function FloatingParticles() {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 6,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        opacity: 0.2,
                    }}
                />
            ))}
        </div>
    );
}

export default function Hero() {
    const { t, i18n } = useTranslation();
    const [url, setUrl] = useState("");
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const stat1 = useAnimatedCounter(2500);
    const stat2 = useAnimatedCounter(150000);
    const stat3 = useAnimatedCounter(98);

    const handleQuickAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/analyze?url=${encodeURIComponent(url)}`);
    };

    return (
        <section className="relative w-full px-4 pt-40 pb-32 sm:pt-44 min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Deep Space Glowing Orbs — enhanced */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen animate-float pointer-events-none -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[150px] mix-blend-screen animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] mix-blend-screen pointer-events-none -z-10" style={{ animationDelay: '4s' }}></div>

            {/* Floating particles */}
            <FloatingParticles />

            <div className="max-w-3xl mx-auto text-center relative z-10">

            {/* Badge */}
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

            {/* Title */}
            <motion.h1
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 text-foreground tracking-tight drop-shadow-lg"
            >
                {t("hero.title1")} <br className="hidden sm:block"/> <span className={`gradient-text drop-shadow-[0_0_25px_rgba(14,165,233,0.4)] ${i18n.language === 'en' ? 'dm-serif' : 'font-bold'}`}>{t("hero.title2")}</span>
            </motion.h1>

            {/* Subtitle */}
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

                    <button type="submit" className="relative overflow-hidden bg-primary hover:bg-white text-primary-foreground font-bold px-6 py-3 rounded-full text-sm transition-all shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105" id="hero-analyze-btn">
                        <span className="relative z-10 flex items-center gap-2">
                            {t("hero.analyzeBtn")}
                            <ArrowRightIcon size={14} className={`text-primary-foreground ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                        </span>
                        <div className="absolute inset-0 shimmer"></div>
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

            {/* ═══ Social Proof Strip ═══ */}
            <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full max-w-3xl mx-auto mt-16 relative z-10"
            >
                <div className="glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-0">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <BarChart3 size={16} className="text-accent" />
                            <span ref={stat1.ref} className="text-2xl font-bold text-foreground animate-count-up">{stat1.count.toLocaleString()}+</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{t("hero.stat_users", "Active Users")}</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-border"></div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <TrendingUp size={16} className="text-accent" />
                            <span ref={stat2.ref} className="text-2xl font-bold text-foreground animate-count-up">{stat2.count >= 1000 ? `${Math.floor(stat2.count / 1000)}K+` : stat2.count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{t("hero.stat_analyses", "SEO Analyses Run")}</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-border"></div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Star size={16} className="text-accent" />
                            <span ref={stat3.ref} className="text-2xl font-bold text-foreground animate-count-up">{stat3.count}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{t("hero.stat_satisfaction", "Satisfaction Rate")}</p>
                    </div>
                </div>
            </motion.div>

            {/* ═══ Feature Cards ═══ */}
            <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-full max-w-6xl mx-auto mt-12 relative z-10"
            >
                <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Rank Updates */}
                    <motion.li
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="glass-premium p-6 text-left relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Zap size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature1_title", "Daily Rank Updates")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature1_desc", "Your keyword positions updated every day automatically. Track your progress over time with historical charts.")}</p>
                        </div>
                    </motion.li>

                    {/* AI-Powered Insights */}
                    <motion.li
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="glass-premium p-6 text-left relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Brain size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature2_title", "AI-Powered Insights")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature2_desc", "Get personalized SEO recommendations powered by Google Gemini AI. Ask questions, get actionable answers.")}</p>
                        </div>
                    </motion.li>

                    {/* Arabic & English */}
                    <motion.li
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="glass-premium p-6 text-left relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="size-14 rounded-2xl bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
                                <Globe size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{t("hero.feature3_title", "Arabic & English Support")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t("hero.feature3_desc", "Full RTL support and bilingual interface built for the MENA market. Reports available in both languages.")}</p>
                        </div>
                    </motion.li>
                </ul>
            </motion.div>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1 opacity-50 mix-blend-overlay">
                <HomeWave />
            </div>
        </section>
    );
}
