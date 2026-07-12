/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeHowItWorksData } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const { t } = useTranslation();
    return (
        <section className="relative max-w-5xl md:min-h-[80vh] mx-auto px-4 py-24 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-foreground">
                    {t("howItWorks.title1")} <span className="gradient-text">{t("howItWorks.title2")}</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">{t("howItWorks.subtitle")}</p>
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none z-0"></div>

                {homeHowItWorksData.map((step: any, i: number) => (
                    <motion.div 
                        key={step.num}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="relative z-10"
                    >
                        <div className="glass border border-border rounded-3xl p-8 text-center h-full hover:bg-muted/50 transition-all group/step relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/step:opacity-100 transition-opacity duration-300"></div>
                            <div className="text-6xl font-black mb-6 bg-gradient-to-br from-primary/20 to-transparent bg-clip-text text-transparent group-hover/step:from-primary/40 transition-colors duration-300">{step.num}</div>
                            <div className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary/80 border border-primary/20 bg-muted/40 group-hover/step:border-primary/40 group-hover/step:scale-110 transition-all duration-300 shadow-sm">{step.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{t(`howItWorks.items.${i}.title`)}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t(`howItWorks.items.${i}.desc`)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
