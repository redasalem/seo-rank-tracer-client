import { useState, useEffect } from "react";
import { Users, Target, BarChart2, ExternalLink, ArrowRight, ArrowLeft, TrendingUp, ShieldAlert, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CompetitorKeyword {
    keyword: string;
    position: number;
    url: string;
}

interface Competitor {
    domain: string;
    keywordCount: number;
    avgPosition: number;
    bestPosition: number;
    topKeywords: CompetitorKeyword[];
}

export default function Competitors() {
    const { t, i18n } = useTranslation();
    const { getGlobalCompetitors } = useApp();
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompetitors = async () => {
            setLoading(true);
            const res = await getGlobalCompetitors();
            if (res.success && res.data) {
                setCompetitors(res.data);
            } else {
                setError(res.message || t("competitors.alerts.loadFailed"));
            }
            setLoading(false);
        };
        fetchCompetitors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPositionColor = (pos: number) => {
        if (pos <= 3) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (pos <= 10) return "text-primary bg-primary/10 border-primary/20";
        if (pos <= 20) return "text-accent bg-accent/10 border-accent/20";
        return "text-danger bg-danger/10 border-danger/20";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center glass-strong rounded-2xl p-10">
                    <AlertCircle size={48} className="mx-auto text-danger mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("competitors.errorTitle")}</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    const mostAggressive = competitors[0];

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Target className="text-primary" size={32} />
                        {t("competitors.header.title1")} <span className="gradient-text">{t("competitors.header.title2")}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t("competitors.header.subtitle")}
                    </p>
                </div>

                {/* KPIs Hero */}
                {competitors.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ animationDelay: "100ms" }}>
                        <div className="glass-strong rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                                <Users size={16} /> {t("competitors.kpi.total")}
                            </p>
                            <h2 className="text-4xl font-bold text-foreground">{competitors.length}</h2>
                            <p className="text-xs text-muted-foreground mt-2">{t("competitors.kpi.uniqueDomains")}</p>
                        </div>
                        
                        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-danger/10 rounded-full blur-2xl group-hover:bg-danger/20 transition-all"></div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-danger" /> {t("competitors.kpi.biggestThreat")}
                            </p>
                            <h2 className="text-2xl font-bold text-foreground truncate" title={mostAggressive?.domain}>
                                {mostAggressive?.domain}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t("competitors.kpi.ranksFor")} <span className="text-primary font-bold">{mostAggressive?.keywordCount}</span> {t("competitors.kpi.ofYourKeywords")}
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all"></div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                                <BarChart2 size={16} className="text-accent" /> {t("competitors.kpi.avgPosition")}
                            </p>
                            <h2 className="text-4xl font-bold text-foreground">
                                {Math.round(competitors.reduce((acc, curr) => acc + curr.avgPosition, 0) / competitors.length) || 0}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-2">{t("competitors.kpi.acrossShared")}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {competitors.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert size={32} className="text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">{t("competitors.empty.title")}</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            {t("competitors.empty.desc")}
                        </p>
                        <Link to="/rank-tracker" className="btn-primary inline-flex items-center gap-2">
                            {t("competitors.empty.goToTrackerBtn")} {i18n.language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        </Link>
                    </div>
                )}

                {/* Competitors List */}
                {competitors.length > 0 && (
                    <div className="space-y-4" style={{ animationDelay: "200ms" }}>
                        <h3 className="text-lg font-semibold text-foreground mb-4">{t("competitors.list.title")}</h3>
                        
                        {competitors.map((comp, index) => {
                            const isExpanded = expandedDomain === comp.domain;
                            
                            // Calculate threat level based on overlap count (relative to max)
                            const maxOverlap = mostAggressive.keywordCount;
                            const threatPercentage = Math.max(10, Math.round((comp.keywordCount / maxOverlap) * 100));
                            
                            return (
                                <div key={comp.domain} className="glass rounded-2xl overflow-hidden transition-all duration-300">
                                    <div 
                                        className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                                        onClick={() => setExpandedDomain(isExpanded ? null : comp.domain)}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center font-bold text-foreground">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-foreground">{comp.domain}</h4>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Target size={14} /> {comp.keywordCount} {t("competitors.list.sharedKeywords")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className={`text-${i18n.language === 'ar' ? 'left' : 'right'} hidden sm:block`}>
                                                <p className="text-xs text-muted-foreground mb-1">{t("competitors.list.avgRank")}</p>
                                                <p className="text-lg font-bold text-foreground">{comp.avgPosition}</p>
                                            </div>
                                            <div className={`text-${i18n.language === 'ar' ? 'left' : 'right'} hidden sm:block`}>
                                                <p className="text-xs text-muted-foreground mb-1">{t("competitors.list.bestRank")}</p>
                                                <p className="text-lg font-bold text-accent">#{comp.bestPosition}</p>
                                            </div>
                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden shrink-0">
                                                <div 
                                                    className="h-full rounded-full"
                                                    style={{ 
                                                        width: `${threatPercentage}%`,
                                                        background: threatPercentage > 75 ? "var(--danger)" : threatPercentage > 40 ? "var(--accent)" : "var(--primary)"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Details */}
                                    {isExpanded && (
                                        <div className="bg-muted/20 border-t border-border p-5">
                                            <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-primary" /> {t("competitors.list.topKeywordsTitle")}
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {comp.topKeywords.map((kw, idx) => (
                                                    <div key={idx} className="glass rounded-xl p-3 flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${getPositionColor(kw.position)}`}>
                                                            #{kw.position}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate" title={kw.keyword}>
                                                                {kw.keyword}
                                                            </p>
                                                        </div>
                                                        <a 
                                                            href={kw.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
