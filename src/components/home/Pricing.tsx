import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";

export default function Pricing() {
    const { t } = useTranslation();
    const { user } = useApp();
    
    const freeBtnLink = user ? "/dashboard" : "/register";
    const proBtnLink = user ? "/settings?tab=subscription" : "/register";
    const maxBtnLink = user ? "/settings?tab=subscription" : "/register";

    const freeFeatures = [
        "5 keywords tracked",
        "5 SEO analyses/day",
        "Basic rank history",
        "In-app notifications",
    ];

    const proFeatures = [
        "50 keywords tracked",
        "20 SEO analyses/day",
        "Full rank history & charts",
        "Competitor analysis",
        "AI SEO Consultant",
        "PDF reports",
        "Priority support",
    ];

    const maxFeatures = [
        "200 keywords tracked",
        "60 SEO analyses/day",
        "Everything in Pro",
        "Advanced competitor insights",
        "Bulk keyword management",
        "Ideal for agencies",
    ];

    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-6xl w-full mx-auto px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                        {t("pricing.title1")} <span className="gradient-text">{t("pricing.title2")}</span>
                    </h2>
                    <p className="text-muted-foreground">{t("pricing.subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free */}
                    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/ forever</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={freeBtnLink} className="block w-full py-3 rounded-xl bg-primary/10 text-secondary-foreground text-center text-sm hover:opacity-90 transition-colors">
                            {user ? "Go to Dashboard" : "Get Started Free"}
                        </Link>
                    </div>

                    {/* Pro — Most Popular */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border border-primary/30 overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium" style={{ color: "var(--background)" }}>
                            Most Popular ⭐
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-primary">$4</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={proBtnLink} className="block w-full py-3 rounded-xl bg-primary text-primary-foreground text-center text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--background)" }}>
                            {user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
                        </Link>
                    </div>

                    {/* Max */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border border-border overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-purple-600 text-white text-xs font-medium">
                            For Agencies
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Max</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$9</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {maxFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={maxBtnLink} className="block w-full py-3 rounded-xl bg-gradient-to-r from-accent to-purple-600 text-white text-center text-sm hover:opacity-90 transition-opacity">
                            {user?.plan === "max" ? "Current Plan" : "Upgrade to Max"}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
