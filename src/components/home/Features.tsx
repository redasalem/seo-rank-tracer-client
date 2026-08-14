/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeFeaturesData } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Typing animation component for AI chat mockup
function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const timer = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
                setDone(true);
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed, started]);

    return (
        <span ref={ref}>
            {displayed}
            {!done && started && <span className="typing-cursor"></span>}
        </span>
    );
}

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function Features() {
    const { t } = useTranslation();
    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-foreground">
                        {t("features.title1")} <span className="gradient-text">{t("features.title2")}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">{t("features.subtitle")}</p>
                </motion.div>

                {/* Feature cards with stagger */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7"
                >
                    {homeFeaturesData.map((f: any, i: number) => (
                        <motion.div
                            key={f.title}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            className="glass-premium p-6 rounded-2xl group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="size-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">{f.icon}</div>
                                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-accent transition-colors">{t(`features.items.${i}.title`)}</h3>
                                <p className="w-5/6 text-sm text-muted-foreground leading-relaxed">{t(`features.items.${i}.desc`)}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* AI Feature Full Width Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 w-full gradient-border overflow-hidden"
                >
                    <div className="glass rounded-[22px] p-8 md:p-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Content */}
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-6 border border-accent/20">
                                <Sparkles size={14} />
                                {t("features.ai_badge", "Powered by Gemini AI")}
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{t("features.ai_title", "Your Personal AI SEO Consultant")}</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {t("features.ai_desc", "Get instant, personalized SEO recommendations powered by Google's Gemini AI. Ask questions about your site's performance, understand complex SEO issues in plain language, and get actionable steps to outrank your competition.")}
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent shrink-0" /> {t("features.ai_check1", "Analyzes your specific SEO report")}
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent shrink-0" /> {t("features.ai_check2", "Answers questions in English & Arabic")}
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent shrink-0" /> {t("features.ai_check3", "Provides step-by-step action plans")}
                                </li>
                            </ul>
                        </div>

                        {/* Right Side: Chat Mockup with typing animation */}
                        <div className="bg-background/80 rounded-2xl p-6 border border-border shadow-xl backdrop-blur-sm relative">
                            <div className="absolute top-4 right-4 flex gap-1.5">
                                <div className="size-3 rounded-full bg-danger/80"></div>
                                <div className="size-3 rounded-full bg-warning/80"></div>
                                <div className="size-3 rounded-full bg-success/80"></div>
                            </div>
                            <div className="mt-6 space-y-6">
                                {/* User message */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="flex justify-end"
                                >
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-foreground max-w-[85%] shadow-sm">
                                        {t("features.ai_chat_user", "Why is my bounce rate so high?")}
                                    </div>
                                </motion.div>
                                {/* AI message with typing */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                    className="flex justify-start items-end gap-2"
                                >
                                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md glow-pulse">
                                        <Sparkles size={14} />
                                    </div>
                                    <div className="bg-primary/5 border border-primary/10 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-foreground max-w-[85%] shadow-sm leading-relaxed">
                                        <TypingText
                                            text={t("features.ai_chat_reply", "Based on your analysis, your page load time is 4.2s which is above the 3s threshold. Here are 3 immediate fixes...")}
                                            speed={25}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
