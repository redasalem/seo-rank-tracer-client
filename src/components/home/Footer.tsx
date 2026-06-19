/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartNoAxesColumnIcon } from "lucide-react";
import { homefooterLinks } from "../../assets/assets";
import { SiX, SiInstagram, SiFacebook, SiTwitch } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-border py-12 bg-card text-foreground">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <ChartNoAxesColumnIcon className="text-primary" />
                            <span className="text-xl">Rank Pilot</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 w-5/6">{t("footer.desc")}</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <SiX size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <SiInstagram size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <SiFacebook size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <SiTwitch size={20} />
                            </a>
                        </div>
                    </div>

                    {homefooterLinks.map((section: any, i: number) => (
                        <div key={section.title}>
                            <h3 className="mb-4">{t(`footer.sections.${i}.title`)}</h3>
                            <ul className="space-y-1">
                                {section.links.map((link: any, j: number) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {t(`footer.sections.${i}.links.${j}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-muted-foreground">{t("footer.status")}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
