import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, ExternalLink, Search, Target, Loader2, ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useApp } from "../context/AppConext";
import toast from "react-hot-toast";

interface KeywordSummary {
    _id: string;
    keyword: string;
    domain: string;
    url: string;
    currentPosition: number | null;
    bestPosition: number | null;
    positionChange: number;
    status: string;
    active: boolean;
    updatedAt: string;
    createdAt: string;
}

export default function History() {
    const { getKeywords, deleteKeyword } = useApp();
    const [keywords, setKeywords] = useState<KeywordSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const fetchKeywords = async () => {
        setLoading(true);
        const res = await getKeywords();
        if (res.success) {
            setKeywords(res.data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, keywordText: string) => {
        if (!confirm(`Are you sure you want to delete tracking for "${keywordText}"?`)) return;
        
        setDeleting(id);
        const res = await deleteKeyword(id);
        if (res.success) {
            setKeywords((prev) => prev.filter((k) => k._id !== id));
            toast.success("Keyword removed");
        } else {
            toast.error(res.message || "Failed to delete");
        }
        setDeleting(null);
    };

    const getPositionColor = (pos: number | null) => {
        if (pos === null) return "text-muted-foreground bg-muted";
        if (pos <= 3) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (pos <= 10) return "text-primary bg-primary/10 border-primary/20";
        return "text-accent bg-accent/10 border-accent/20";
    };

    const getChangeIndicator = (change: number) => {
        if (change > 0) return { icon: <TrendingUp size={14} />, text: `+${change}`, class: "text-emerald-500" };
        if (change < 0) return { icon: <TrendingDown size={14} />, text: `${Math.abs(change)}`, class: "text-danger" };
        return { icon: <Minus size={14} />, text: "—", class: "text-muted-foreground" };
    };

    let processedData = [...keywords];

    if (searchQuery) {
        processedData = processedData.filter((k) => 
            k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || 
            k.domain.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    processedData.sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "highest_rank") {
            // Nulls at the bottom
            if (a.currentPosition === null) return 1;
            if (b.currentPosition === null) return -1;
            return a.currentPosition - b.currentPosition;
        } else if (sortBy === "lowest_rank") {
            if (a.currentPosition === null) return 1;
            if (b.currentPosition === null) return -1;
            return b.currentPosition - a.currentPosition;
        }
        return 0;
    });

    useEffect(() => {
        fetchKeywords();
    }, []);

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
                            Keywords <span className="gradient-text">History</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage all your tracked keywords and view their current rankings.</p>
                    </div>
                    <Link to="/rank-tracker" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity self-start" style={{ color: "var(--background)" }}>
                        Track New Keyword
                    </Link>
                </div>

                {/* Filters Row */}
                <div className="mb-6 flex flex-col md:flex-row gap-3" style={{ animationDelay: "100ms" }}>
                    <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
                        <Search size={18} className="text-muted-foreground" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by keyword or domain..." className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1" id="history-search-input" />
                    </div>

                    <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <ArrowUpDown size={16} className="text-muted-foreground" />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                            <option value="newest" className="bg-background">Newest First</option>
                            <option value="oldest" className="bg-background">Oldest First</option>
                            <option value="highest_rank" className="bg-background">Highest Rank (#1)</option>
                            <option value="lowest_rank" className="bg-background">Lowest Rank</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center py-30">
                        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : processedData.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Target size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{searchQuery ? "No matching keywords" : "No keywords yet"}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{searchQuery ? "Try a different search term." : "Start tracking your first keyword to see it here."}</p>
                        {!searchQuery && (
                            <Link to="/rank-tracker" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity inline-block" style={{ color: "var(--background)" }}>
                                Go to Rank Tracker
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3" style={{ animationDelay: "200ms" }}>
                        {processedData.map((k) => {
                            const change = getChangeIndicator(k.positionChange);
                            
                            return (
                            <div key={k._id} className="glass rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-muted/50 transition-all group">
                                {/* Rank Badge */}
                                <div className="shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center ${getPositionColor(k.currentPosition)}`}>
                                        <span className="text-[10px] uppercase font-bold opacity-70">Rank</span>
                                        <span className="text-xl font-bold leading-tight">{k.currentPosition ? `#${k.currentPosition}` : "-"}</span>
                                    </div>
                                </div>

                                {/* Keyword Info */}
                                <div className="flex-1 min-w-0">
                                    <Link to={`/rank/${k._id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block">
                                        "{k.keyword}"
                                    </Link>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{k.domain}</p>
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(k.updatedAt).toLocaleDateString()}
                                        </span>
                                        
                                        <span className={`text-xs flex items-center gap-1 font-medium ${change.class}`}>
                                            {change.icon} {change.text}
                                        </span>

                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${k.status === "success" ? "bg-emerald-500/10 text-emerald-500" : k.status === "pending" ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"}`}>
                                            {k.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link to={`/rank/${k._id}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all" title="View Details">
                                        <ExternalLink size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(k._id, k.keyword)} disabled={deleting === k._id} className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-50" title="Delete Tracking">
                                        {deleting === k._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
        </div>
    );
}
