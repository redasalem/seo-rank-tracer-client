/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeFeaturesData } from "../../assets/assets";
import { useTranslation } from "react-i18next";

export default function Features() {
    const { t } = useTranslation();
    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-foreground">
                        {t("features.title1")} <span className="gradient-text">{t("features.title2")}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">{t("features.subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                    {homeFeaturesData.map((f: any, i: number) => (
                        <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:bg-muted/30 backdrop-blur transition-all group">
                            <div className="text-primary mb-4 group-hover:translate-y-1 transition-transform duration-300 inline-block">{f.icon}</div>
                            <h3 className="text-lg font-medium mb-2 text-foreground">{t(`features.items.${i}.title`)}</h3>
                            <p className="w-5/6 text-sm text-muted-foreground leading-relaxed">{t(`features.items.${i}.desc`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
