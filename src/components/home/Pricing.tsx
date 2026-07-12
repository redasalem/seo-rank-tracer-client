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
                    <div className="glass border border-border rounded-3xl p-8 flex flex-col hover:scale-[1.02] transition-transform duration-300">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/ forever</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={freeBtnLink} className="block w-full py-3 rounded-xl bg-muted/50 text-foreground font-semibold border border-border text-center text-sm hover:bg-muted transition-colors">
                            {user ? "Go to Dashboard" : "Get Started Free"}
                        </Link>
                    </div>

                    {/* Pro — Most Popular */}
                    <div className="relative rounded-3xl p-8 flex flex-col glass border-2 border-primary/40 hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 z-10 overflow-visible">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[26px] blur-md opacity-20 -z-10"></div>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold whitespace-nowrap shadow-md">
                            Most Popular ⭐
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-bold text-primary">$4</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <div className="text-xs text-primary/70 font-medium mb-6">Most chosen by freelancers</div>
                        
                        <ul className="space-y-3 mb-8 flex-1">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={proBtnLink} className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-center text-sm hover:shadow-lg hover:shadow-primary/30 transition-all">
                            {user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
                        </Link>
                    </div>

                    {/* Max */}
                    <div className="relative rounded-3xl p-8 flex flex-col glass border border-border hover:scale-[1.02] transition-transform duration-300">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Max</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-bold text-foreground">$9</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <div className="text-xs text-purple-500 font-medium mb-6">Best for agencies</div>
                        
                        <ul className="space-y-3 mb-8 flex-1">
                            {maxFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={maxBtnLink} className="block w-full py-3 rounded-xl bg-gradient-to-r from-gray-800 to-black text-white font-semibold text-center text-sm hover:opacity-90 transition-opacity dark:from-gray-200 dark:to-white dark:text-black">
                            {user?.plan === "max" ? "Current Plan" : "Upgrade to Max"}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
