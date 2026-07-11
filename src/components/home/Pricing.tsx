import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";

export default function Pricing() {
    const { t } = useTranslation();
    const { user } = useApp();
    
    // Arrays for mapping so we don't have messy code in the return
    const freeFeatures = [0, 1, 2, 3, 4];
    const proFeatures = [0, 1, 2, 3, 4, 5];
    
    const freeBtnLink = user ? "/dashboard" : "/register";
    const proBtnLink = user ? "/settings?tab=subscription" : "/register";

    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-5xl w-full mx-auto px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                        {t("pricing.title1")} <span className="gradient-text">{t("pricing.title2")}</span>
                    </h2>
                    <p className="text-muted-foreground">{t("pricing.subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free */}
                    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">{t("pricing.freePlan.title")}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">{t("pricing.freePlan.price")}</span>
                            <span className="text-muted-foreground">{t("pricing.freePlan.period")}</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {freeFeatures.map((i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {t(`pricing.freePlan.features.${i}`)}
                                </li>
                            ))}
                        </ul>
                        <Link to={freeBtnLink} className="block w-full py-3 rounded-xl bg-primary/10 text-secondary-foreground text-center text-sm hover:opacity-90 transition-colors">
                            {t("pricing.freePlan.btn")}
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border border-primary/30 overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium" style={{ color: "var(--background)" }}>
                            {t("pricing.proPlan.badge")}
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">{t("pricing.proPlan.title")}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-primary">{t("pricing.proPlan.price")}</span>
                            <span className="text-muted-foreground">{t("pricing.proPlan.period")}</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {proFeatures.map((i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {t(`pricing.proPlan.features.${i}`)}
                                </li>
                            ))}
                        </ul>
                        <Link to={proBtnLink} className="block w-full py-3 rounded-xl bg-primary text-primary-foreground text-center text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--background)" }}>
                            {t("pricing.proPlan.btn")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
