/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeFeaturesData } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";

export default function Features() {
    const { t } = useTranslation();
    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-foreground">
                        {t("features.title1")} <span className="gradient-text">{t("features.title2")}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">{t("features.subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                    {homeFeaturesData.map((f: any, i: number) => (
                        <div key={f.title} className="glass p-6 rounded-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                            <div className="size-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">{f.icon}</div>
                            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-accent transition-colors">{t(`features.items.${i}.title`)}</h3>
                            <p className="w-5/6 text-sm text-muted-foreground leading-relaxed">{t(`features.items.${i}.desc`)}</p>
                        </div>
                    ))}
                </div>

                {/* AI Feature Full Width Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 w-full rounded-3xl p-1 bg-gradient-to-r from-primary/30 to-accent/30 overflow-hidden"
                >
                    <div className="glass rounded-[22px] p-8 md:p-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Content */}
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-6 border border-accent/20">
                                <Sparkles size={14} />
                                Powered by Gemini AI
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Your Personal AI SEO Consultant</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Get instant, personalized SEO recommendations powered by Google's Gemini AI. Ask questions about your site's performance, understand complex SEO issues in plain language, and get actionable steps to outrank your competition.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent" /> Analyzes your specific SEO report
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent" /> Answers questions in English & Arabic
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={18} className="text-accent" /> Provides step-by-step action plans
                                </li>
                            </ul>
                        </div>

                        {/* Right Side: Chat Mockup */}
                        <div className="bg-background/80 rounded-2xl p-6 border border-border shadow-xl backdrop-blur-sm relative">
                            <div className="absolute top-4 right-4 flex gap-1.5">
                                <div className="size-3 rounded-full bg-danger/80"></div>
                                <div className="size-3 rounded-full bg-warning/80"></div>
                                <div className="size-3 rounded-full bg-success/80"></div>
                            </div>
                            <div className="mt-6 space-y-6">
                                {/* User message */}
                                <div className="flex justify-end">
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-foreground max-w-[85%] shadow-sm">
                                        Why is my bounce rate so high?
                                    </div>
                                </div>
                                {/* AI message */}
                                <div className="flex justify-start items-end gap-2">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Sparkles size={14} />
                                    </div>
                                    <div className="bg-primary/5 border border-primary/10 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-foreground max-w-[85%] shadow-sm leading-relaxed">
                                        Based on your analysis, your page load time is <span className="font-semibold text-danger">4.2s</span> which is above the 3s threshold. Here are 3 immediate fixes...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
