import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, ArrowRightIcon, TrendingUpIcon, Target, Trophy, Activity, ArrowUpCircle, FileSearchIcon, Zap, Loader2, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

// TypeScript Interfaces for strict typing
interface KeywordStat {
    _id: string;
    keyword: string;
    domain: string;
    currentPosition: number | null;
    positionChange: number;
    status: string;
}

interface AnalysisStat {
    _id: string;
    url: string;
    domain: string;
    overallScore: number;
    status: string;
    createdAt: string;
}

interface DashboardStats {
    totalKeywords: number;
    inTop10: number;
    bestPosition: number | null;
    averageRank: number | null;
    biggestImprover: { keyword: string; positionChange: number } | null;
    rankDistribution: { name: string; value: number; color: string }[];
    historyData: { date: string; averageRank: number }[];
    recentKeywords: KeywordStat[];
    recentAnalyses: AnalysisStat[];
    analysisLimit: { plan: string; used: number; max: number | 'unlimited' } | null;
}

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const { user, getDashboardStats } = useApp();
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const res = await getDashboardStats();
        if (res.success) {
            setStats(res.data);
        }
        setLoading(false);
    };

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            navigate(`/analyze?url=${encodeURIComponent(url)}`);
        }
    };

    // ─── Helpers ─────────────────────────────────────────────────────────────────
    const getPositionColor = (pos: number | null) => {
        if (pos === null) return "text-muted-foreground";
        if (pos <= 3) return "text-emerald-500";
        if (pos <= 10) return "text-primary";
        return "text-accent";
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (score >= 50) return "text-primary bg-primary/10 border-primary/20";
        return "text-danger bg-danger/10 border-danger/20";
    };

    const getChangeText = (change: number) => {
        if (change > 0) return { text: `+${change}`, class: "text-emerald-500" };
        if (change < 0) return { text: `${change}`, class: "text-danger" };
        return { text: "—", class: "text-muted-foreground" };
    };

    useEffect(() => {
        (async () => await fetchData())();
    }, []);

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                    <p className="text-sm text-primary">{t("dashboard.charts.avgRank")}: #{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-1">
                        {t("dashboard.welcome")} <span className="gradient-text">{user?.name || "User"}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">{t("dashboard.subtitle")}</p>
                </div>

                {/* Quick Analyze & Limit Info */}
                <div className="mb-10 max-w-2xl" style={{ animationDelay: "100ms" }}>
                    <form onSubmit={handleAnalyze} className="border border-primary/20 rounded-full p-2 flex items-center gap-2 mb-3 bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 flex-1 px-3">
                            <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("dashboard.searchPlaceholder")} className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-3" id="dashboard-url-input" />
                        </div>
                        <button type="submit" className="bg-primary px-5 py-3 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2" style={{ color: "var(--background)" }} id="dashboard-analyze-btn">
                            {t("dashboard.analyzeBtn")}
                            <ArrowRightIcon size={16} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                        </button>
                    </form>
                    
                    {stats?.analysisLimit && stats.analysisLimit.plan === 'free' && (
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all ${stats!.analysisLimit!.used >= 10 ? 'bg-danger' : 'bg-primary'}`} 
                                    style={{ width: `${Math.min(100, (stats!.analysisLimit!.used / 10) * 100)}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground shrink-0">
                                {stats!.analysisLimit!.used} / 10 Free Analyses Used
                            </span>
                            {stats!.analysisLimit!.used >= 10 && (
                                <Link to="/settings?tab=subscription" className="text-xs font-bold text-primary hover:underline">
                                    Upgrade to Pro
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* KPIs / Stats */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
                >
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Target size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats?.totalKeywords || 0}</p>
                            <p className="text-xs text-muted-foreground">{t("dashboard.stats.keywordsTracked")}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <TrendingUpIcon size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-500">{stats?.inTop10 || 0}</p>
                            <p className="text-xs text-muted-foreground">{t("dashboard.stats.inTop10")}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            <Trophy size={22} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${getPositionColor(stats?.bestPosition ?? null)}`}>{stats?.bestPosition ? `#${stats.bestPosition}` : "—"}</p>
                            <p className="text-xs text-muted-foreground">{t("dashboard.stats.bestRanking")}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <Activity size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats?.averageRank ? `#${stats.averageRank}` : "—"}</p>
                            <p className="text-xs text-muted-foreground">{t("dashboard.stats.averageRank")}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <ArrowUpCircle size={22} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-emerald-500 truncate">{stats?.biggestImprover && stats.biggestImprover.positionChange > 0 ? `+${stats.biggestImprover.positionChange}` : "—"}</p>
                            <p className="text-xs text-muted-foreground truncate" title={stats?.biggestImprover ? stats.biggestImprover.keyword : ""}>{stats?.biggestImprover && stats.biggestImprover.positionChange > 0 ? stats.biggestImprover.keyword : t("dashboard.stats.biggestImprover")}</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Charts Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
                >
                    {/* Line Chart */}
                    <div className="glass rounded-2xl p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-foreground mb-6">{t("dashboard.charts.trendTitle")}</h2>
                        {loading ? (
                            <div className="h-[250px] flex items-end justify-between gap-2 px-2 pb-4">
                                {[1,2,3,4,5,6,7].map((i) => (
                                    <div key={i} className="w-full bg-muted/50 rounded-t-md animate-pulse" style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                        ) : !stats?.historyData || stats.historyData.length < 2 ? (
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                                {t("dashboard.charts.noTrendData")}
                            </div>
                        ) : (
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats!.historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} reversed={true} domain={['dataMin', 'dataMax + 10']} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="averageRank" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Pie Chart */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-6">{t("dashboard.charts.distTitle")}</h2>
                        {loading ? (
                            <div className="h-[250px] flex items-center justify-center">
                                <div className="w-48 h-48 rounded-full border-[16px] border-muted/50 animate-pulse"></div>
                            </div>
                        ) : !stats?.rankDistribution || stats.rankDistribution.length === 0 ? (
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                                {t("dashboard.charts.noDistData")}
                            </div>
                        ) : (
                            <div className="h-[250px] w-full relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stats!.rankDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" animationDuration={1000}>
                                            {stats!.rankDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold text-foreground">{stats?.totalKeywords}</span>
                                    <span className="text-xs text-muted-foreground">{t("dashboard.charts.total")}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Two Columns: Recent Analyses & Recent Keywords */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Recent Analyses */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <FileSearchIcon size={18} className="text-primary" />
                                Recent SEO Analyses
                            </h2>
                            {stats?.recentAnalyses && stats.recentAnalyses.length > 0 && (
                                <Link to="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    View History <ArrowRightIcon size={14} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                                </Link>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1,2].map((i) => (
                                    <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 animate-pulse">
                                        <div className="w-12 h-12 rounded-xl bg-muted/80 shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted/80 rounded w-1/3"></div>
                                            <div className="h-3 bg-muted/80 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !stats?.recentAnalyses || stats.recentAnalyses.length === 0 ? (
                            <div className="glass rounded-2xl p-10 text-center border border-dashed border-muted">
                                <Zap size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                                <h3 className="text-base font-medium text-foreground mb-1">No reports yet</h3>
                                <p className="text-xs text-muted-foreground mb-4">Run your first SEO analysis above.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats!.recentAnalyses.map((analysis) => (
                                    <Link key={analysis._id} to={`/report/${analysis._id}`} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-all block">
                                        <div className="shrink-0">
                                            {analysis.status === 'completed' ? (
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border ${getScoreColor(analysis.overallScore)}`}>
                                                    {analysis.overallScore}
                                                </div>
                                            ) : analysis.status === 'failed' ? (
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-danger bg-danger/10 border border-danger/20">
                                                    <AlertCircle size={20} />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
                                                    <Loader2 size={20} className="animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate" title={analysis.url}>{analysis.url.replace(/^https?:\/\//, '')}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(analysis.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                                            {analysis.status}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Keywords */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Target size={18} className="text-primary" />
                                {t("dashboard.keywords.title")}
                            </h2>
                            {stats?.recentKeywords && stats.recentKeywords.length > 0 && (
                                <Link to="/rank-tracker" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    {t("dashboard.keywords.viewAll")} <ArrowRightIcon size={14} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                                </Link>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1,2,3].map((i) => (
                                    <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 animate-pulse">
                                        <div className="w-12 h-12 rounded-xl bg-muted/80 shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted/80 rounded w-1/3"></div>
                                            <div className="h-3 bg-muted/80 rounded w-1/4"></div>
                                        </div>
                                        <div className="w-8 h-4 bg-muted/80 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : !stats?.recentKeywords || stats.recentKeywords.length === 0 ? (
                            <div className="glass rounded-2xl p-10 text-center border border-dashed border-muted">
                                <Target size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                                <h3 className="text-base font-medium text-foreground mb-1">{t("dashboard.keywords.noKeywordsTitle")}</h3>
                                <p className="text-xs text-muted-foreground mb-4">{t("dashboard.keywords.noKeywordsDesc")}</p>
                                <Link to="/rank-tracker" className="bg-primary px-5 py-2 rounded-xl text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity inline-block" style={{ color: "var(--background)" }}>
                                    {t("dashboard.keywords.goToTracker")}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats!.recentKeywords.slice(0, 3).map((kw) => {
                                    const change = getChangeText(kw.positionChange);
                                    return (
                                        <Link key={kw._id} to={`/rank/${kw._id}`} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-all block">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${kw.currentPosition && kw.currentPosition <= 10 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : kw.currentPosition ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border"}`}>
                                                {kw.currentPosition ? `#${kw.currentPosition}` : "—"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">"{kw.keyword}"</p>
                                                <p className="text-xs text-muted-foreground truncate">{kw.domain}</p>
                                            </div>
                                            <div className={`text-sm font-medium ${change.class}`}>
                                                {change.text}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
