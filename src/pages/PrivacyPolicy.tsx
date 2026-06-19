import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PrivacyPolicy() {
    const { t, i18n } = useTranslation();

    return (
        <div className="min-h-screen pt-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                    {t("common.back", "Back to Home")}
                </Link>

                <div className="glass-strong rounded-3xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{t("legal.privacy.title", "Privacy Policy")}</h1>
                    <p className="text-muted-foreground mb-6">{t("legal.privacy.lastUpdated", "Last updated:")} {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-muted-foreground">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.privacy.section1.title", "1. Information We Collect")}</h2>
                            <p>{t("legal.privacy.section1.desc", "We collect information you provide directly to us when you create an account, subscribe to our newsletter, or use our services.")}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.privacy.section2.title", "2. How We Use Your Information")}</h2>
                            <p>{t("legal.privacy.section2.desc", "We use the information we collect to operate, maintain, and provide the features and functionality of the Service, as well as to communicate directly with you.")}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">{t("legal.privacy.section3.title", "3. Data Security")}</h2>
                            <p>{t("legal.privacy.section3.desc", "We care about the security of your information and use commercially reasonable safeguards to preserve the integrity and security of all information we collect.")}</p>
                        </section>
                        
                        <p className="pt-8 border-t border-border mt-12 text-sm">
                            {t("legal.privacy.note", "This is a template privacy policy. Please update it with your actual legal privacy policy.")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
