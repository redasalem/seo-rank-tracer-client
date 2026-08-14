/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeHowItWorksData } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const stepVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

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

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {/* Animated Connecting Line (Desktop) */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[2px] origin-left pointer-events-none z-0"
                    style={{
                        background: "linear-gradient(90deg, transparent, var(--accent), transparent)"
                    }}
                />

                {homeHowItWorksData.map((step: any, i: number) => (
                    <motion.div
                        key={step.num}
                        variants={stepVariants}
                        className="relative z-10"
                    >
                        <motion.div
                            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            className="glass-premium border border-border rounded-3xl p-8 text-center h-full group/step relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 origin-left group-hover/step:scale-x-100 transition-transform duration-500"></div>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                                className="text-6xl font-black mb-6 bg-gradient-to-br from-primary/20 to-transparent bg-clip-text text-transparent group-hover/step:from-primary/40 transition-colors duration-300"
                            >
                                {step.num}
                            </motion.div>
                            <div className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary/80 border border-primary/20 bg-muted/40 group-hover/step:border-accent/40 group-hover/step:scale-110 group-hover/step:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 shadow-sm">{step.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{t(`howItWorks.items.${i}.title`)}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t(`howItWorks.items.${i}.desc`)}</p>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
