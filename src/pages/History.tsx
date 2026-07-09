import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, ArrowUpDown, FileSearchIcon, GlobeIcon, Gauge, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface AnalysisSummary {
    _id: string;
    url: string;
    domain: string;
    status: string;
    overallScore: number;
    categories: {
        seo: number;
        performance: number;
        accessibility: number;
        bestPractices: number;
    };
    loadTime: number;
    pageSize: number;
    createdAt: string;
}

export default function History() {
    const { t, i18n } = useTranslation();
    const { getAnalysisHistory } = useApp();
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHistory = async (pageNumber = 1) => {
        setLoading(true);
        const res = await getAnalysisHistory({ page: pageNumber, limit: 12 });
        if (res.success && res.data) {
            setAnalyses(res.data as unknown as AnalysisSummary[]);
            setTotalPages(res.totalPages || 1);
            setPage(res.page || 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchHistory(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    let processedData = [...analyses];

    if (searchQuery) {
        processedData = processedData.filter((a) => 
            a.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.domain.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    processedData.sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "highest_score") {
            return b.overallScore - a.overallScore;
        } else if (sortBy === "lowest_score") {
            return a.overallScore - b.overallScore;
        }
        return 0;
    });

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (score >= 50) return "text-primary bg-primary/10 border-primary/20";
        return "text-danger bg-danger/10 border-danger/20";
    };

    const formatBytes = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
                            {t("history.title1")} <span className="gradient-text">{t("history.title2")}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">{t("history.subtitle")}</p>
                    </div>
                    <Link to="/analyze" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity self-start" style={{ color: "var(--background)" }}>
                        {t("history.analyzeNewBtn")}
                    </Link>
                </div>

                {/* Filters Row */}
                <div className="mb-6 flex flex-col md:flex-row gap-3">
                    <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
                        <Search size={18} className="text-muted-foreground" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("history.searchPlaceholder")} className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1" id="history-search-input" />
                    </div>

                    <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <ArrowUpDown size={16} className="text-muted-foreground" />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                            <option value="newest" className="bg-background">{t("history.sort.newest")}</option>
                            <option value="oldest" className="bg-background">{t("history.sort.oldest")}</option>
                            <option value="highest_score" className="bg-background">{t("history.sort.highestScore")}</option>
                            <option value="lowest_score" className="bg-background">{t("history.sort.lowestScore")}</option>
                        </select>
                    </div>
                </div>

                {/* List / Grid */}
                {loading && analyses.length === 0 ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : processedData.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <FileSearchIcon size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{searchQuery ? t("history.empty.noMatchTitle") : t("history.empty.noReportsTitle")}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{searchQuery ? t("history.empty.noMatchDesc") : t("history.empty.noReportsDesc")}</p>
                        {!searchQuery && (
                            <Link to="/analyze" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity inline-block" style={{ color: "var(--background)" }}>
                                {t("history.empty.goToAnalyzeBtn")}
                            </Link>
                        )}
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {processedData.map((report) => (
                            <motion.div key={report._id} variants={itemVariants}>
                                <Link to={`/report/${report._id}`} className="block glass rounded-2xl p-5 hover:bg-muted/30 transition-all group h-full flex flex-col">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1 truncate">
                                                <GlobeIcon size={12} /> {report.domain}
                                            </p>
                                            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors" title={report.url}>
                                                {report.url.replace(/^https?:\/\//, '')}
                                            </h3>
                                        </div>
                                        {report.status === 'completed' ? (
                                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${getScoreColor(report.overallScore)}`}>
                                                {report.overallScore}
                                            </div>
                                        ) : report.status === 'failed' ? (
                                            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-danger bg-danger/10 border border-danger/20">
                                                <AlertCircle size={20} />
                                            </div>
                                        ) : (
                                            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
                                                <Loader2 size={20} className="animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    {report.status === 'completed' && (
                                        <div className="grid grid-cols-2 gap-2 mt-auto">
                                            <div className="bg-background/50 rounded-lg p-2 flex items-center gap-2">
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-muted-foreground uppercase">{t("history.card.seo")}</p>
                                                    <p className="text-sm font-bold text-foreground truncate">{report.categories?.seo || 0}/100</p>
                                                </div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-2 flex items-center gap-2">
                                                <Gauge size={14} className="text-primary" />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-muted-foreground uppercase">{t("history.card.speed")}</p>
                                                    <p className="text-sm font-bold text-foreground truncate">{report.loadTime ? (report.loadTime / 1000).toFixed(1) + 's' : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{new Date(report.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        {report.pageSize > 0 && <span>{formatBytes(report.pageSize)}</span>}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button 
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-xl glass text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                        >
                            {t("history.pagination.prev")}
                        </button>
                        <span className="text-sm text-muted-foreground">
                            {page} / {totalPages}
                        </span>
                        <button 
                            disabled={page === totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-xl glass text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                        >
                            {t("history.pagination.next")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
