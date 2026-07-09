import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ScoreGauge from "../components/ScoreGauge";
import IssueCard from "../components/IssueCard";
import { ArrowLeft, ArrowRight, Globe, Clock, FileText, Image, Link2, Heading, Tag, AlertCircle, ExternalLink, Type, Search, Download, Shield, FileCode, Bot, Map } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import html2pdf from "html2pdf.js";

interface AnalysisData {
    _id: string;
    url: string;
    overallScore: number;
    status: string;
    createdAt: string;
    loadTime: number;
    pageSize: number;
    wordCount: number;
    categories: {
        seo: number;
        performance: number;
        accessibility: number;
        bestPractices: number;
    };
    metaData: {
        title: string;
        description: string;
        canonical: string;
        robots: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
        twitterCard: string;
        viewport: string;
        charset: string;
    };
    headings: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
        h1Texts: string[];
    };
    links: {
        internal: number;
        external: number;
        total: number;
    };
    images: {
        total: number;
        missingAlt: number;
        withAlt: number;
    };
    keywords: { word: string; count: number; density: number }[];
    issues: { severity: string; category: string; message: string; recommendation: string }[];
    advancedSEO?: {
        hasSSL: boolean;
        sslIssuer: string;
        sslValidTo: string;
        hasRobotsTxt: boolean;
        hasSitemap: boolean;
        schemaTypes: string[];
    };
}

export default function Report() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const { getAnalysis } = useApp();
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    const fetchAnalysis = async () => {
        if (!id) return;
        setLoading(true);
        const res = await getAnalysis(id);
        
        if (res.success && res.data) {
            setAnalysis(res.data as unknown as AnalysisData);
        } else {
            setError(res.message || t("report.notFound"));
        }
        setLoading(false);
    };

    const getScoreClass = (s: number) => {
        if (s >= 80) return "score-good";
        if (s >= 50) return "score-medium";
        return "score-poor";
    };

    const getScoreBgClass = (s: number) => {
        if (s >= 80) return "score-bg-good";
        if (s >= 50) return "score-bg-medium";
        return "score-bg-poor";
    };

    const tabs = [
        { id: "overview", label: t("report.tabs.overview") },
        { id: "meta", label: t("report.tabs.meta") },
        { id: "content", label: t("report.tabs.content") },
        { id: "advanced", label: t("report.tabs.advanced") },
        { id: "issues", label: t("report.tabs.issues") },
    ];

    useEffect(() => {
        (async () => await fetchAnalysis())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">{t("report.loading")}</p>
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center bg-card border border-border rounded-2xl p-10">
                    <AlertCircle size={48} className="mx-auto text-danger mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("report.notFound")}</h2>
                    <p className="text-muted-foreground text-sm mb-6">{error || t("report.notFoundDesc")}</p>
                    <Link to="/dashboard" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block" style={{ color: "var(--background)" }}>
                        {t("report.backToDash")}
                    </Link>
                </div>
            </div>
        );
    }

    if (analysis.status === "failed") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center bg-card border border-border rounded-2xl p-10">
                    <AlertCircle size={48} className="mx-auto text-danger mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("report.analysisFailed")}</h2>
                    <p className="text-muted-foreground text-sm mb-6">{t("report.failedDesc")}</p>
                    <Link to="/analyze" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block" style={{ color: "var(--background)" }}>
                        {t("report.tryAgain")}
                    </Link>
                </div>
            </div>
        );
    }

    const criticalCount = analysis.issues.filter((i) => i.severity === "critical").length;
    const warningCount = analysis.issues.filter((i) => i.severity === "warning").length;
    const infoCount = analysis.issues.filter((i) => i.severity === "info").length;

    const handleExportPdf = () => {
        const element = document.getElementById("report-content");
        if (!element) return;

        // Hide no-print elements during export
        const noPrintElements = element.querySelectorAll(".no-print");
        noPrintElements.forEach(el => (el as HTMLElement).style.display = "none");

        const hostname = new URL(analysis.url).hostname;
        const date = new Date(analysis.createdAt).toLocaleDateString();

        const opt = {
            margin: [10, 10, 10, 10] as [number, number, number, number],
            filename: `RankBoost_Report_${hostname}_${date}.pdf`,
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // Restore no-print elements after export
            noPrintElements.forEach(el => (el as HTMLElement).style.display = "");
        });
    };

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Back + Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors no-print">
                            {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                            {t("report.backToDash")}
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-medium text-foreground truncate">{new URL(analysis.url).hostname}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary truncate flex items-center gap-1 transition-colors">
                                        {analysis.url}
                                        <ExternalLink size={12} />
                                    </a>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleExportPdf} className="bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-2 self-start no-print">
                        <Download size={18} />
                        {t("report.exportPdf")}
                    </button>
                </div>

                {/* Score Hero */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6" style={{ animationDelay: "100ms" }}>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Overall Score */}
                        <ScoreGauge score={analysis.overallScore} size={160} strokeWidth={12} label={t("report.score.overall")} />

                        {/* Category Scores */}
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: t("report.score.seo"), value: analysis.categories.seo, icon: <Search size={18} /> },
                                    { label: t("report.score.performance"), value: analysis.categories.performance, icon: <Clock size={18} /> },
                                    { label: t("report.score.accessibility"), value: analysis.categories.accessibility, icon: <Globe size={18} /> },
                                    { label: t("report.score.bestPractices"), value: analysis.categories.bestPractices, icon: <Tag size={18} /> },
                                ].map((cat) => (
                                    <div key={cat.label} className={`rounded-xl p-4 border text-center ${getScoreBgClass(cat.value)}`}>
                                        <div className="flex items-center justify-center gap-1.5 mb-2 text-muted-foreground/80">
                                            {cat.icon}
                                            <span className="text-xs font-medium">{cat.label}</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getScoreClass(cat.value)}`}>{cat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-primary">{analysis.loadTime}ms</p>
                                    <p className="text-[10px] text-muted-foreground">{t("report.score.loadTime")}</p>
                                </div>
                                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-secondary">{Math.round(analysis.pageSize / 1024)}KB</p>
                                    <p className="text-[10px] text-muted-foreground">{t("report.score.pageSize")}</p>
                                </div>
                                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-accent">{analysis.wordCount.toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground">{t("report.score.words")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 overflow-x-auto pb-1 print-tabs-nav" style={{ animationDelay: "200ms" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                            style={activeTab === tab.id ? { color: "var(--background)" } : {}}
                        >
                            {tab.label}
                            {tab.id === "issues" && analysis.issues.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-danger/20 text-danger">{analysis.issues.length}</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="print-show-all">
                    <div className={activeTab === "overview" ? "block" : "hidden"}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Issues Summary */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-danger" />
                                    {t("report.overview.issuesSummary")}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="severity-critical rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold">{criticalCount}</p>
                                        <p className="text-xs mt-1">{t("report.overview.critical")}</p>
                                    </div>
                                    <div className="severity-warning rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold">{warningCount}</p>
                                        <p className="text-xs mt-1">{t("report.overview.warnings")}</p>
                                    </div>
                                    <div className="severity-info rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold">{infoCount}</p>
                                        <p className="text-xs mt-1">{t("report.overview.info")}</p>
                                    </div>
                                </div>

                                {analysis.issues.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {analysis.issues.slice(0, 3).map((issue, i) => (
                                            <IssueCard key={i} issue={issue} />
                                        ))}
                                        {analysis.issues.length > 3 && (
                                            <button onClick={() => setActiveTab("issues")} className="w-full text-center text-sm text-primary hover:underline py-2">
                                                {t("report.overview.viewAll", { count: analysis.issues.length })}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Links & Images */}
                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Link2 size={20} className="text-primary" />
                                        {t("report.overview.linksAnalysis")}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-primary">{analysis.links.internal}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.internal")}</p>
                                        </div>
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-secondary">{analysis.links.external}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.external")}</p>
                                        </div>
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-accent">{analysis.links.total}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.total")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Image size={20} className="text-accent" />
                                        {t("report.overview.imagesAudit")}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold">{analysis.images.total}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.total")}</p>
                                        </div>
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-success">{analysis.images.withAlt}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.withAlt")}</p>
                                        </div>
                                        <div className="glass rounded-xl p-4 text-center">
                                            <p className={`text-2xl font-bold ${analysis.images.missingAlt > 0 ? "text-danger" : "text-success"}`}>{analysis.images.missingAlt}</p>
                                            <p className="text-xs text-gray-500">{t("report.overview.missingAlt")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Headings */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Heading size={20} className="text-secondary" />
                                    {t("report.overview.headingStructure")}
                                </h3>
                                <div className="space-y-2">
                                    {["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => {
                                        const count = analysis.headings[tag as keyof typeof analysis.headings] as number;
                                        const maxBar = Math.max(analysis.headings.h1, analysis.headings.h2, analysis.headings.h3, analysis.headings.h4, analysis.headings.h5, analysis.headings.h6, 1);
                                        return (
                                            <div key={tag} className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-gray-400 w-6 uppercase">{tag}</span>
                                                <div className="flex-1 h-6 rounded-lg bg-white/5 overflow-hidden">
                                                    <div className="h-full rounded-lg gradient-bg transition-all" style={{ width: `${(count / maxBar) * 100}%`, minWidth: count > 0 ? "20px" : "0" }} />
                                                </div>
                                                <span className={`text-sm font-bold w-6 text-right ${tag === "h1" && count !== 1 ? "text-danger" : ""}`}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {analysis.headings.h1Texts.length > 0 && (
                                    <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">{t("report.overview.h1Text")}</p>
                                        {analysis.headings.h1Texts.map((text, i) => (
                                            <p key={i} className="text-sm text-gray-300 truncate">
                                                {text}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Keywords */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Type size={20} className="text-warning" />
                                    {t("report.overview.topKeywords")}
                                </h3>
                                {analysis.keywords.length > 0 ? (
                                    <div className="space-y-2">
                                        {analysis.keywords.map((kw, i) => (
                                            <div key={kw.word} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                                                <span className="flex-1 text-sm font-medium">{kw.word}</span>
                                                <span className="text-xs text-gray-400">{kw.count}×</span>
                                                <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(kw.density * 10, 100)}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500 w-12 text-right">{kw.density}%</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">{t("report.overview.noKeywords")}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "meta" ? "block" : "hidden"}>
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-primary" />
                                {t("report.meta.title")}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: t("report.meta.tags.title"), value: analysis.metaData.title, ideal: t("report.meta.ideals.title"), len: analysis.metaData.title.length },
                                    { label: t("report.meta.tags.description"), value: analysis.metaData.description, ideal: t("report.meta.ideals.description"), len: analysis.metaData.description.length },
                                    { label: t("report.meta.tags.canonical"), value: analysis.metaData.canonical },
                                    { label: t("report.meta.tags.robots"), value: analysis.metaData.robots },
                                    { label: t("report.meta.tags.viewport"), value: analysis.metaData.viewport },
                                    { label: t("report.meta.tags.charset"), value: analysis.metaData.charset },
                                    { label: t("report.meta.tags.ogTitle"), value: analysis.metaData.ogTitle },
                                    { label: t("report.meta.tags.ogDescription"), value: analysis.metaData.ogDescription },
                                    { label: t("report.meta.tags.ogImage"), value: analysis.metaData.ogImage },
                                    { label: t("report.meta.tags.twitterCard"), value: analysis.metaData.twitterCard },
                                ].map((meta) => (
                                    <div key={meta.label} className="bg-muted/50 border border-border rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-foreground">{meta.label}</span>
                                            <div className="flex items-center gap-2">
                                                {meta.len !== undefined && <span className="text-xs text-muted-foreground">{meta.len} {t("report.meta.chars")}</span>}
                                                {meta.value ? <span className="w-2 h-2 rounded-full bg-success" /> : <span className="w-2 h-2 rounded-full bg-danger" />}
                                            </div>
                                        </div>
                                        {meta.value ? <p className="text-sm text-muted-foreground break-all">{meta.value}</p> : <p className="text-sm text-danger/60 italic">{t("report.meta.missing")}</p>}
                                        {meta.ideal && <p className="text-[10px] text-gray-600 mt-1">{t("report.meta.ideal")}{meta.ideal}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "content" ? "block" : "hidden"}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">{t("report.content.statsTitle")}</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.wordCount")}</span>
                                        <span className="font-bold text-foreground">{analysis.wordCount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.pageSize")}</span>
                                        <span className="font-bold text-foreground">{Math.round(analysis.pageSize / 1024)} KB</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.loadTime")}</span>
                                        <span className={`font-bold ${analysis.loadTime < 3000 ? "score-good" : analysis.loadTime < 5000 ? "score-medium" : "score-poor"}`}>{(analysis.loadTime / 1000).toFixed(2)}s</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.totalLinks")}</span>
                                        <span className="font-bold text-foreground">{analysis.links.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.totalImages")}</span>
                                        <span className="font-bold text-foreground">{analysis.images.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                                        <span className="text-sm text-muted-foreground">{t("report.content.totalHeadings")}</span>
                                        <span className="font-bold text-foreground">{analysis.headings.h1 + analysis.headings.h2 + analysis.headings.h3 + analysis.headings.h4 + analysis.headings.h5 + analysis.headings.h6}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">{t("report.content.hierarchyTitle")}</h3>
                                <div className="space-y-2">
                                    {["h1", "h2", "h3", "h4", "h5", "h6"].map((tag, i) => {
                                        const count = analysis.headings[tag as keyof typeof analysis.headings] as number;
                                        return (
                                            <div key={tag} className="flex items-center gap-3 p-2.5 bg-muted/30 border border-border rounded-lg" style={{ paddingLeft: `${i * 12 + 12}px` }}>
                                                <span className="text-xs font-mono font-bold text-primary uppercase">&lt;{tag}&gt;</span>
                                                <span className="text-sm text-muted-foreground flex-1">
                                                    {count} {count === 1 ? t("report.content.tag") : t("report.content.tags")}
                                                </span>
                                                {tag === "h1" && <span className={`text-xs px-2 py-0.5 rounded-full ${count === 1 ? "score-bg-good text-success" : "score-bg-poor text-danger"}`}>{count === 1 ? t("report.content.good") : count === 0 ? t("report.content.missing") : t("report.content.multiple")}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "advanced" ? "block" : "hidden"}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Security (SSL) */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Shield size={20} className={analysis.advancedSEO?.hasSSL ? "text-success" : "text-danger"} />
                                    {t("report.advanced.security")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysis.advancedSEO?.hasSSL ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{t("report.advanced.sslCert")}</p>
                                                <p className="text-xs text-muted-foreground">{analysis.advancedSEO?.sslIssuer || t("report.advanced.unknownIssuer")}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.advancedSEO?.hasSSL ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                                            {analysis.advancedSEO?.hasSSL ? t("report.advanced.secure") : t("report.advanced.insecure")}
                                        </span>
                                    </div>
                                    {analysis.advancedSEO?.hasSSL && analysis.advancedSEO?.sslValidTo && (
                                        <p className="text-sm text-muted-foreground ml-2 flex items-center gap-2">
                                            <Clock size={14} /> {t("report.advanced.validUntil")} {new Date(analysis.advancedSEO.sslValidTo).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Crawling Files */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Bot size={20} className="text-primary" />
                                    {t("report.advanced.crawling")}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Bot size={18} className="text-muted-foreground" />
                                            <span className="font-medium text-foreground">{t("report.advanced.robots")}</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${analysis.advancedSEO?.hasRobotsTxt ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                                            {analysis.advancedSEO?.hasRobotsTxt ? t("report.advanced.found") : t("report.advanced.missing")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Map size={18} className="text-muted-foreground" />
                                            <span className="font-medium text-foreground">{t("report.advanced.sitemap")}</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${analysis.advancedSEO?.hasSitemap ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                                            {analysis.advancedSEO?.hasSitemap ? t("report.advanced.found") : t("report.advanced.notDetected")}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 px-1">
                                        {t("report.advanced.sitemapNote")}
                                    </p>
                                </div>
                            </div>

                            {/* Schema Markup */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <FileCode size={20} className="text-accent" />
                                    {t("report.advanced.schema")}
                                </h3>
                                {analysis.advancedSEO?.schemaTypes && analysis.advancedSEO.schemaTypes.length > 0 ? (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {t("report.advanced.schemaDesc")}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.advancedSEO.schemaTypes.map((type, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-medium flex items-center gap-2">
                                                    <FileCode size={14} />
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 bg-muted/30 border border-border rounded-xl">
                                        <FileCode size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                                        <p className="text-sm font-medium text-foreground">{t("report.advanced.noSchema")}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{t("report.advanced.noSchemaDesc")}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "issues" ? "block" : "hidden"}>
                        <div>
                            {analysis.issues.length > 0 ? (
                                <>
                                    {/* Issue filters */}
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <span className="text-sm text-muted-foreground">{t("report.issues.filter")}</span>
                                        <span className="severity-critical px-2.5 py-1 rounded-full text-xs font-semibold">{t("report.issues.criticalCount", { count: criticalCount })}</span>
                                        <span className="severity-warning px-2.5 py-1 rounded-full text-xs font-semibold">{t("report.issues.warningsCount", { count: warningCount })}</span>
                                        <span className="severity-info px-2.5 py-1 rounded-full text-xs font-semibold">{t("report.issues.infoCount", { count: infoCount })}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {analysis.issues.map((issue, i) => (
                                            <IssueCard key={i} issue={issue} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle size={32} className="text-success" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{t("report.issues.noIssues")}</h3>
                                    <p className="text-sm text-muted-foreground">{t("report.issues.noIssuesDesc")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
