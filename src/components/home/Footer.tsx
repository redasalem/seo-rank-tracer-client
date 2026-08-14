import { ChartNoAxesColumnIcon, Mail } from "lucide-react";
import { homefooterLinks } from "../../assets/assets";
import { SiX, SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function LinkedInIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
        </svg>
    );
}

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-border py-12 bg-card text-foreground">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-xl bg-accent/10 border border-accent/20">
                                <ChartNoAxesColumnIcon size={18} className="text-accent" aria-hidden="true" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">RankBoost</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 w-5/6">{t("footer.desc")}</p>
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="Follow us on X (Twitter)" className="text-muted-foreground hover:text-accent transition-colors">
                                <SiX size={18} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Follow us on Instagram" className="text-muted-foreground hover:text-accent transition-colors">
                                <SiInstagram size={18} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Follow us on Facebook" className="text-muted-foreground hover:text-accent transition-colors">
                                <SiFacebook size={18} aria-hidden="true" />
                            </a>
                            <a href="#" aria-label="Follow us on LinkedIn" className="text-muted-foreground hover:text-accent transition-colors">
                                <LinkedInIcon size={18} />
                            </a>
                        </div>
                    </div>

                    {homefooterLinks.map((section: any, i: number) => (
                        <div key={section.title}>
                            <h3 className="mb-4 font-semibold text-sm text-foreground">{t(`footer.sections.${i}.title`)}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link: any, j: number) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                                            {t(`footer.sections.${i}.links.${j}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h3 className="mb-4 font-semibold text-sm text-foreground">{t("footer.support_title", "Support")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="mailto:support@rankboost.com" className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5">
                                    <Mail size={14} />
                                    support@rankboost.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-success animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">{t("footer.status")}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
