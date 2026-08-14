import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    qEn: string;
    qAr: string;
    aEn: string;
    aAr: string;
}

const faqs: FAQItem[] = [
    {
        qEn: "How does the SEO analysis work?",
        qAr: "كيف يعمل الفحص الشامل للـ SEO؟",
        aEn: "Our cloud-powered crawler analyzes your URL across technical performance, on-page SEO, mobile responsiveness, accessibility, and security. We then use Google Gemini AI to formulate actionable, customized recommendations.",
        aAr: "يقوم الروبوت السحابي بفحص الرابط الخاص بك عبر الأداء الفني، السيو الداخلي، التوافق مع الهواتف، إمكانية الوصول والأمان، ثم نستخدم ذكاء Google Gemini لاقتراح خطة عمل مخصصة وقابلة للتطبيق فوراً."
    },
    {
        qEn: "How frequently are keyword ranks updated?",
        qAr: "كم مرة يتم تحديث ترتيب الكلمات المفتاحية؟",
        aEn: "We check your keyword positions daily across Google search results in your targeted country and device. You can also trigger manual refreshes anytime.",
        aAr: "يتم تحديث ترتيب الكلمات المفتاحية يومياً عبر نتائج بحث Google حسب الدولة والجهاز المحددين، كما يمكنك طلب تحديث فوري في أي وقت يدوياً."
    },
    {
        qEn: "Can I export PDF reports for my clients?",
        qAr: "هل يمكنني تصدير تقارير PDF لعملائي؟",
        aEn: "Yes! Pro and Max plan users can export comprehensive white-label PDF audit reports in both English and Arabic with one click.",
        aAr: "نعم! يمكن لمشتركي باقتي Pro و Max تصدير تقارير فحص احترافية بصيغة PDF باللغتين العربية والإنجليزية بضغطة زر واحدة."
    },
    {
        qEn: "Is there a free trial or free tier?",
        qAr: "هل توجد باقة مجانية لتجربة الخدمة؟",
        aEn: "Absolutely. Our Free plan lets you run daily SEO audits and track your top keywords with no credit card required.",
        aAr: "بالتأكيد! تتيح لك الباقة المجانية إجراء فحوصات SEO يومية وتتبع أهم كلماتك بدون الحاجة لإدخال أي بيانات بطاقة ائتمان."
    },
    {
        qEn: "How does the AI SEO Consultant work?",
        qAr: "كيف يعمل مستشار السيو بالذكاء الاصطناعي؟",
        aEn: "Inside every SEO report, an integrated Gemini AI assistant has full context of your audit findings. You can chat with it in Arabic or English to get custom code snippets, fix instructions, and content suggestions.",
        aAr: "داخل كل تقرير فحص، يتوفر مساعد Gemini ذكي يمتلك السياق الكامل لنتائج الفحص. يمكنك التحدث معه بالعربية أو الإنجليزية للحصول على أكواد وحلول تفصيلية وإرشادات لكتابة المحتوى."
    }
];

export default function FAQ() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === "ar";
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section className="relative w-full max-w-4xl mx-auto px-4 py-24 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 border border-accent/20">
                    <HelpCircle size={14} />
                    {t("faq.badge", "Frequently Asked Questions")}
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                    {t("faq.title1", "Got Questions?")} <span className="gradient-text">{t("faq.title2", "We've Got Answers")}</span>
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    {t("faq.subtitle", "Everything you need to know about RankBoost, billing, and rank tracking.")}
                </p>
            </motion.div>

            <div className="space-y-4">
                {faqs.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="glass-premium rounded-2xl overflow-hidden border border-border/80"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors"
                            >
                                <span className="font-bold text-base text-foreground">
                                    {isAr ? faq.qAr : faq.qEn}
                                </span>
                                <div className={`size-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-accent/10 border-accent/30 text-accent" : "text-muted-foreground"}`}>
                                    <ChevronDown size={16} />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                    >
                                        <div className="px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                                            {isAr ? faq.aAr : faq.aEn}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
