import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const testimonials = [
    {
        name: "Karim Mansour",
        role: "Head of Growth @ Digital MENA",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        en: "RankBoost completely transformed our SEO workflow. Tracking Arab and global keywords daily with Gemini insights saved us 15+ hours every week.",
        ar: "رانك بوست غيّر طريقة عملنا في الـ SEO تماماً. تتبع الكلمات المفتاحية يومياً مع تحليلات Gemini وفّر علينا أكتر من 15 ساعة شغل أسبوعياً."
    },
    {
        name: "Sarah Al-Hassan",
        role: "E-Commerce Founder",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        en: "The on-page audit and competitor tracker are unmatched. We jumped from page 4 to top 3 on Google for our primary high-intent keywords.",
        ar: "الفحص الشامل وتتبع المنافسين أداءهم لا يُعلى عليه. قدرنا نطلع من الصفحة الرابعة لأول 3 نتائج على جوجل في أهم الكلمات المفتاحية."
    },
    {
        name: "Omar Tarek",
        role: "SEO & Content Lead",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        en: "The bilingual Arabic/English interface and reports are exactly what agency teams in the Middle East have been waiting for. Highly recommended!",
        ar: "الواجهة والتقارير ثنائية اللغة (عربي وإنجليزي) هي بالظبط اللي كانت وكالات التسويق في الشرق الأوسط محتاجاه. أنصح به بشدة!"
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function Testimonials() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === "ar";

    return (
        <section className="relative w-full max-w-6xl mx-auto px-4 py-24 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 border border-accent/20">
                    <Star size={14} className="fill-accent" />
                    {t("testimonials.badge", "Wall of Love")}
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                    {t("testimonials.title1", "Loved by")} <span className="gradient-text">{t("testimonials.title2", "Founders & SEO Leaders")}</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    {t("testimonials.subtitle", "See how teams and agencies use RankBoost to dominate search rankings.")}
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {testimonials.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={cardVariants}
                        whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                        className="glass-premium p-8 rounded-3xl flex flex-col justify-between relative group"
                    >
                        <Quote size={32} className="text-accent/20 absolute top-6 right-6 pointer-events-none group-hover:text-accent/40 transition-colors" />
                        <div>
                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-5">
                                {Array.from({ length: item.rating }).map((_, starIndex) => (
                                    <Star key={starIndex} size={16} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            {/* Review content */}
                            <p className="text-sm text-foreground/90 leading-relaxed mb-6 font-normal">
                                "{isAr ? item.ar : item.en}"
                            </p>
                        </div>

                        {/* Author info */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                            <img
                                src={item.avatar}
                                alt={item.name}
                                className="size-11 rounded-full object-cover border-2 border-accent/30 shadow-md"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">{item.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
