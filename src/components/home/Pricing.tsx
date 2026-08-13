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

    const freeFeatures = (t("pricing.free.features", { returnObjects: true }) as string[]) || [];
    const proFeatures = (t("pricing.pro.features", { returnObjects: true }) as string[]) || [];
    const maxFeatures = (t("pricing.max.features", { returnObjects: true }) as string[]) || [];

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
                    <div className="glass p-8 rounded-3xl flex flex-col hover:-translate-y-2 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-1 text-foreground">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-foreground">$0</span>
                            <span className="text-muted-foreground text-sm">/ forever</span>
                        </div>
                        <ul className="space-y-3.5 mb-8 flex-1">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <CheckCircle size={16} className="text-accent shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={freeBtnLink} className="block w-full py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-center text-sm hover:bg-accent/10 hover:border-accent/30 transition-all">
                            {user ? "Go to Dashboard" : "Get Started Free"}
                        </Link>
                    </div>

                    {/* Pro — Most Popular */}
                    <div className="relative rounded-3xl p-8 flex flex-col glass border-2 border-accent/60 hover:-translate-y-2 shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all duration-300 z-10 overflow-visible">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[26px] blur-lg opacity-25 -z-10"></div>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent to-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                            Most Popular ⭐
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-foreground">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-extrabold text-foreground">$9</span>
                            <span className="text-muted-foreground text-sm">/ month</span>
                        </div>
                        <div className="text-xs text-accent font-semibold mb-6">Most chosen by freelancers</div>
                        
                        <ul className="space-y-3.5 mb-8 flex-1">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle size={16} className="text-accent shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={proBtnLink} className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-blue-500 text-white font-bold text-center text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all">
                            {user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
                        </Link>
                    </div>

                    {/* Max */}
                    <div className="relative rounded-3xl p-8 flex flex-col glass border border-purple-500/30 hover:-translate-y-2 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-1 text-foreground">Max</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-extrabold text-foreground">$19</span>
                            <span className="text-muted-foreground text-sm">/ month</span>
                        </div>
                        <div className="text-xs text-purple-400 font-semibold mb-6">Best for agencies</div>
                        
                        <ul className="space-y-3.5 mb-8 flex-1">
                            {maxFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <CheckCircle size={16} className="text-purple-400 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={maxBtnLink} className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-center text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] hover:scale-[1.02] transition-all">
                            {user?.plan === "max" ? "Current Plan" : "Upgrade to Max"}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
