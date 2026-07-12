import { SearchIcon, ArrowRightIcon, Star } from "lucide-react";
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
        <section className="relative w-full px-4 pt-40 pb-32 sm:pt-44 min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="max-w-3xl mx-auto text-center relative z-10">
            
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
            </div>

            {/* Social Proof Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="w-full max-w-6xl mx-auto mt-20 relative z-10"
            >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 border-y border-border/50 py-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-1">500+</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Websites Analyzed</div>
                    </div>
                    <div className="text-center md:border-x border-border/50">
                        <div className="text-4xl font-bold text-foreground mb-1">10K+</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Keywords Tracked</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-1">98%</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Customer Satisfaction</div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex gap-1 mb-4 text-warning">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed mb-6 italic">"RankBoost helped us climb from position 45 to top 5 in just 3 months. The AI insights are incredibly actionable."</p>
                        <div>
                            <div className="font-semibold text-foreground">Sarah Mitchell</div>
                            <div className="text-xs text-muted-foreground">SEO Manager, TechFlow</div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex gap-1 mb-4 text-warning">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed mb-6 italic">"Finally an SEO tool that speaks Arabic! The bilingual support and daily rank tracking have transformed our workflow."</p>
                        <div>
                            <div className="font-semibold text-foreground">Ahmed Al-Rashid</div>
                            <div className="text-xs text-muted-foreground">Digital Marketing Lead, GrowthHub</div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="glass p-6 text-left relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex gap-1 mb-4 text-warning">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed mb-6 italic">"At $4/month, RankBoost Pro is unbeatable value. I use it for all my clients and the competitor analysis saves hours."</p>
                        <div>
                            <div className="font-semibold text-foreground">Emma Rodriguez</div>
                            <div className="text-xs text-muted-foreground">Freelance SEO Consultant</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none -z-1">
                <HomeWave />
            </div>
        </section>
    );
}
