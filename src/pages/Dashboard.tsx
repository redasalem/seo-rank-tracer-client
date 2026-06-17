import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, ArrowRightIcon, BarChart3Icon, GlobeIcon, TrendingUpIcon, Target, Trophy } from "lucide-react";
import { useApp } from "../context/AppConext";

interface KeywordSummary {
    _id: string;
    keyword: string;
    domain: string;
    currentPosition: number | null;
    positionChange: number;
    status: string;
    active: boolean;
    updatedAt: string;
}

export default function Dashboard() {
    const { user, getKeywords } = useApp();
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [keywords, setKeywords] = useState<KeywordSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const res = await getKeywords();
        if (res.success) {
            setKeywords(res.data || []);
        }
        setLoading(false);
    };

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            navigate(`/analyze?url=${encodeURIComponent(url)}`);
        }
    };

    // إحصائيات مبنية على بيانات حقيقية
    const totalKeywords = keywords.length;
    const inTop10 = keywords.filter((k) => k.currentPosition !== null && k.currentPosition <= 10).length;
    const bestPos = keywords.reduce((best, k) => {
        if (k.currentPosition !== null && (best === null || k.currentPosition < best)) return k.currentPosition;
        return best;
    }, null as number | null);

    const getPositionColor = (pos: number | null) => {
        if (pos === null) return "text-muted-foreground";
        if (pos <= 3) return "text-emerald-500";
        if (pos <= 10) return "text-primary";
        return "text-accent";
    };

    const getChangeText = (change: number) => {
        if (change > 0) return { text: `+${change}`, class: "text-emerald-500" };
        if (change < 0) return { text: `${change}`, class: "text-danger" };
        return { text: "—", class: "text-muted-foreground" };
    };

    useEffect(() => {
        (async () => await fetchData())();
    }, []);

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-1">
                        Welcome back, <span className="gradient-text">{user?.name || "User"}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Analyze websites and boost your SEO performance.</p>
                </div>

                {/* Quick Analyze */}
                <form onSubmit={handleAnalyze} className="mb-10" style={{ animationDelay: "100ms" }}>
                    <div className="border border-primary/20 rounded-full p-2 flex items-center gap-2 max-w-2xl">
                        <div className="flex items-center gap-3 flex-1 px-3">
                            <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter a URL to analyze..." className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-3" id="dashboard-url-input" />
                        </div>
                        <button type="submit" className="bg-primary px-5 py-3 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2" style={{ color: "var(--background)" }} id="dashboard-analyze-btn">
                            Analyze
                            <ArrowRightIcon size={16} />
                        </button>
                    </div>
                </form>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Target size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{totalKeywords}</p>
                            <p className="text-xs text-muted-foreground">Keywords Tracked</p>
                        </div>
                    </div>
                    <div className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUpIcon size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-500">{inTop10}</p>
                            <p className="text-xs text-muted-foreground">In Top 10</p>
                        </div>
                    </div>
                    <div className="glass rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <Trophy size={22} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${getPositionColor(bestPos)}`}>{bestPos ? `#${bestPos}` : "—"}</p>
                            <p className="text-xs text-muted-foreground">Best Ranking</p>
                        </div>
                    </div>
                </div>

                {/* Recent Keywords */}
                <div style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-foreground">Tracked Keywords</h2>
                        {keywords.length > 0 && (
                            <Link to="/rank-tracker" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowRightIcon size={14} />
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-30">
                            <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : keywords.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <Target size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No keywords tracked yet</h3>
                            <p className="text-sm text-muted-foreground mb-6">Start tracking your keywords to see your rankings here.</p>
                            <Link to="/rank-tracker" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity inline-block" style={{ color: "var(--background)" }}>
                                Go to Rank Tracker
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {keywords.slice(0, 5).map((kw) => {
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
            </div>
        </div>
    );
}
