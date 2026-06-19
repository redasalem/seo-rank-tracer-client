import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TermsOfService() {
    const { t, i18n } = useTranslation();

    return (
        <div className="min-h-screen pt-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                    {t("common.back", "Back to Home")}
                </Link>

                <div className="glass-strong rounded-3xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{t("legal.terms.title", "Terms of Service")}</h1>
                    <p className="text-muted-foreground mb-6">{t("legal.terms.lastUpdated", "Last updated:")} {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-muted-foreground">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.terms.section1.title", "1. Acceptance of Terms")}</h2>
                            <p>{t("legal.terms.section1.desc", "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.")}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.terms.section2.title", "2. Service Provision")}</h2>
                            <p>{t("legal.terms.section2.desc", "We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.")}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.terms.section3.title", "3. User Accounts")}</h2>
                            <p>{t("legal.terms.section3.desc", "To use certain features of the Service, you must register for an account. You are responsible for maintaining confidentiality.")}</p>
                        </section>
                        
                        <p className="pt-8 border-t border-border mt-12 text-sm">
                            {t("legal.terms.note", "This is a template terms of service. Please update it with your actual legal terms.")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
