
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Plus, RefreshCw, Trash2, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Loader2, X, Search, Globe, AlertCircle, Eye, EyeOff, Filter, ArrowUpDown, Download, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface KeywordItem {
    _id: string;
    keyword: string;
    url: string;
    domain: string;
    currentPosition: number | null;
    currentPage: number | null;
    bestPosition: number | null;
    positionChange: number;
    active: boolean;
    updatedAt: string;
    createdAt: string;
    status: string;
    competitors: { position: number; url: string; domain: string; snippet: string }[];
}

export default function RankTracker() {
    const { t, i18n } = useTranslation();
    const [keywords, setKeywords] = useState<KeywordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [country, setCountry] = useState("US");
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState("");
    const [refreshing, setRefreshing] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const { getKeywords, addKeyword, deleteKeyword, toggleKeyword, refreshKeyword } = useApp();

    const fetchKeywords = async () => {
        setLoading(true);
        const res = await getKeywords({
            page,
            limit: 10,
            search: searchQuery,
            status: statusFilter,
            sortBy
        });
        if (res.success) {
            setKeywords((res.data as unknown as KeywordItem[]) || []);
            setTotalPages(res.totalPages || 1);
            setTotalCount(res.total || 0);
        } else {
            toast.error("Failed to load keywords");
        }
        setLoading(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setAddError("");
        const res = await addKeyword({ keyword: newKeyword, url: newUrl, country });
        if (res.success) {
            toast.success(t("rankTracker.alerts.added"));
            setShowAddModal(false);
            setNewKeyword("");
            setNewUrl("");
            setCountry("US");
            fetchKeywords();
        } else {
            setAddError(res.message || t("rankTracker.alerts.addFailed"));
        }
        setAdding(false);
    };

    const handleRefresh = async (id: string) => {
        setRefreshing(id);
        const toastId = toast.loading(t("rankTracker.alerts.refreshing"));
        const res = await refreshKeyword(id);
        if (res.success) {
            toast.success(t("rankTracker.alerts.refreshing"), { id: toastId });
            fetchKeywords();
        } else {
            toast.error(res.message || t("rankTracker.alerts.refreshFailed"), { id: toastId });
        }
        setRefreshing(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("rankTracker.alerts.deleteConfirm"))) return;
        setDeleting(id);
        const res = await deleteKeyword(id);
        if (res.success) {
            toast.success(t("rankTracker.alerts.deleted"));
            fetchKeywords();
        } else {
            toast.error(res.message || t("rankTracker.alerts.deleteFailed"));
        }
        setDeleting(null);
    };

    const handleToggle = async (id: string) => {
        const res = await toggleKeyword(id);
        if (res.success) {
            toast.success(res.message || t("rankTracker.alerts.toggleSuccess"));
            fetchKeywords();
        } else {
            toast.error(res.message || t("rankTracker.alerts.toggleFailed"));
        }
    };

    const handleExportCSV = async () => {
        // Fetch all keywords for export without pagination
        const toastId = toast.loading(t("rankTracker.alerts.exportPrep"));
        const res = await getKeywords({ limit: 10000, search: searchQuery, status: statusFilter, sortBy });
        
        if (!res.success || !res.data || res.data.length === 0) {
            toast.error(t("rankTracker.alerts.exportEmpty"), { id: toastId });
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Keyword,Domain,URL,Current Position,Best Position,Change,Last Checked\n";

        (res.data as unknown as KeywordItem[]).forEach((kw: KeywordItem) => {
            const row = [
                `"${kw.keyword}"`,
                `"${kw.domain}"`,
                `"${kw.url}"`,
                kw.currentPosition || t("rankTracker.item.notRanked"),
                kw.bestPosition || "-",
                kw.positionChange,
                kw.updatedAt ? new Date(kw.updatedAt).toLocaleDateString() : "-"
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rank_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("rankTracker.alerts.exportSuccess"), { id: toastId });
    };

    const getPositionBadge = (pos: number | null) => {
        if (pos === null) return { text: t("rankTracker.item.notRanked"), class: "text-muted-foreground bg-muted/50" };
        if (pos <= 3) return { text: `#${pos}`, class: "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30" };
        if (pos <= 10) return { text: `#${pos}`, class: "text-primary bg-primary/15 border border-primary/30" };
        if (pos <= 20) return { text: `#${pos}`, class: "text-accent bg-accent/15 border border-accent/30" };
        return { text: `#${pos}`, class: "text-danger bg-danger/15 border border-danger/30" };
    };

    const getChangeIndicator = (change: number) => {
        if (change > 0) return { icon: <TrendingUp size={14} />, text: `+${change}`, class: "text-emerald-500" };
        if (change < 0) return { icon: <TrendingDown size={14} />, text: `${change}`, class: "text-danger" };
        return { icon: <Minus size={14} />, text: "0", class: "text-muted-foreground" };
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchKeywords();
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilter, sortBy, page]);

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
                            <span className="gradient-text">{t("rankTracker.title")}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">{t("rankTracker.subtitle")}</p>
                    </div>
                    <div className="flex gap-2 self-start">
                        <button onClick={handleExportCSV} className="bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                            <Download size={18} />
                            {t("rankTracker.exportBtn")}
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2" id="add-keyword-btn" style={{ color: "var(--background)" }}>
                            <Plus size={18} />
                            {t("rankTracker.trackBtn")}
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="mb-6 flex flex-col md:flex-row gap-3" style={{ animationDelay: "100ms" }}>
                    <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
                        <Search size={18} className="text-muted-foreground" />
                        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder={t("rankTracker.searchPlaceholder")} className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1" id="rank-search-input" />
                    </div>

                    <div className="flex gap-3">
                        <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <select value={statusFilter} onChange={handleStatusChange} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="all" className="bg-background">
                                    {t("rankTracker.filters.allStatus")}
                                </option>
                                <option value="active" className="bg-background">
                                    {t("rankTracker.filters.active")}
                                </option>
                                <option value="paused" className="bg-background">
                                    {t("rankTracker.filters.paused")}
                                </option>
                            </select>
                        </div>
                        <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
                            <ArrowUpDown size={16} className="text-muted-foreground" />
                            <select value={sortBy} onChange={handleSortChange} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="newest" className="bg-background">
                                    {t("rankTracker.filters.newest")}
                                </option>
                                <option value="rank_asc" className="bg-background">
                                    {t("rankTracker.filters.highest")}
                                </option>
                                <option value="rank_desc" className="bg-background">
                                    {t("rankTracker.filters.lowest")}
                                </option>
                                <option value="change" className="bg-background">
                                    {t("rankTracker.filters.biggestGain")}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Keywords List */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : keywords.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Target size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{t("rankTracker.empty.title")}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{t("rankTracker.empty.desc")}</p>
                        <button onClick={() => setShowAddModal(true)} className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity" style={{ color: "var(--background)" }}>
                            {t("rankTracker.trackBtn")}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3" style={{ animationDelay: "200ms" }}>
                        {keywords.map((kw) => {
                            const posBadge = getPositionBadge(kw.currentPosition);
                            const change = getChangeIndicator(kw.positionChange);

                            return (
                                <div key={kw._id} className={`glass rounded-xl p-5 hover:bg-muted/50 transition-all ${!kw.active ? "opacity-50" : ""}`}>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Rank badge */}
                                        <div className="flex items-center gap-4 lg:w-32 shrink-0">
                                            {kw.status === "pending" ? (
                                                <div className="w-16 h-16 rounded-xl glass flex items-center justify-center">
                                                    <Loader2 size={24} className="text-primary animate-spin" />
                                                </div>
                                            ) : (
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold ${posBadge.class}`}>{kw.currentPosition ? `#${kw.currentPosition}` : "—"}</div>
                                            )}
                                            {kw.status === "success" && kw.currentPosition && (
                                                <div className="text-center mt-1">
                                                    <div className={`flex items-center justify-center gap-1 text-sm font-medium ${change.class}`}>
                                                        {change.icon}
                                                        {change.text}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{t("rankTracker.item.change")}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link to={`/rank/${kw._id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors block truncate">
                                                "{kw.keyword}"
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Globe size={12} className="text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground truncate">{kw.domain}</span>
                                                {kw.currentPage && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{t("rankTracker.item.page")} {kw.currentPage}</span>}
                                            </div>
                                            {kw.updatedAt && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock size={10} />
                                                    {t("rankTracker.item.lastChecked")}: {new Date(kw.updatedAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        {kw.status === "success" && (
                                            <div className="hidden md:flex items-center gap-5">
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-primary">{kw.bestPosition || "—"}</p>
                                                    <p className="text-[10px] text-muted-foreground">{t("rankTracker.item.best")}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-accent">{kw.competitors?.length || 0}</p>
                                                    <p className="text-[10px] text-muted-foreground">{t("rankTracker.item.competitors")}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <Link to={`/rank/${kw._id}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all" title="View Details">
                                                <ExternalLink size={16} />
                                            </Link>
                                            <button onClick={() => handleRefresh(kw._id)} disabled={refreshing === kw._id || kw.status === "pending"} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all disabled:opacity-30" title="Refresh Ranking">
                                                <RefreshCw size={16} className={refreshing === kw._id ? "animate-spin" : ""} />
                                            </button>
                                            <button
                                                onClick={() => handleToggle(kw._id)}
                                                className={`p-2 rounded-lg hover:bg-muted transition-all ${kw.active ? "text-success hover:text-success" : "text-muted-foreground hover:text-foreground"}`}
                                                title={kw.active ? "Pause Tracking" : "Resume Tracking"}
                                            >
                                                {kw.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button onClick={() => handleDelete(kw._id)} disabled={deleting === kw._id} className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-50" title="Delete">
                                                {deleting === kw._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 glass p-4 rounded-2xl">
                                <p className="text-sm text-muted-foreground">
                                    {t("rankTracker.pagination.showing")} <span className="font-medium text-foreground">{(page - 1) * 10 + 1}</span> {t("rankTracker.pagination.to")} <span className="font-medium text-foreground">{Math.min(page * 10, totalCount)}</span> {t("rankTracker.pagination.of")} <span className="font-medium text-foreground">{totalCount}</span> {t("rankTracker.pagination.keywords")}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        disabled={page === 1} 
                                        onClick={() => setPage(p => p - 1)} 
                                        className={`flex items-center gap-1 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <ChevronLeft size={16} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                                        {t("rankTracker.pagination.prev")}
                                    </button>
                                    <div className="px-4 py-2 text-sm font-medium text-foreground bg-primary/10 text-primary rounded-xl border border-primary/20">
                                        {t("rankTracker.pagination.page")} {page} {t("rankTracker.pagination.of")} {totalPages}
                                    </div>
                                    <button 
                                        disabled={page === totalPages} 
                                        onClick={() => setPage(p => p + 1)} 
                                        className={`flex items-center gap-1 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {t("rankTracker.pagination.next")}
                                        <ChevronRight size={16} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">{t("rankTracker.modal.title")}</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setAddError("");
                                }}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {addError && (
                            <div className="mb-4 px-4 py-3 rounded-xl severity-critical text-sm flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{addError}</span>
                                </div>
                                {addError.includes("limit") && (
                                    <Link 
                                        to="/settings?tab=subscription" 
                                        className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 self-start"
                                        style={{ color: "var(--background)" }}
                                    >
                                        {t("rankTracker.modal.upgradeBtn")}
                                    </Link>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label htmlFor="modal-keyword" className="block text-sm font-medium text-foreground mb-1.5">
                                    {t("rankTracker.modal.keywordLabel")}
                                </label>
                                <div className="relative">
                                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="modal-keyword"
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        placeholder={t("rankTracker.modal.keywordPlaceholder")}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal-url" className="block text-sm font-medium text-foreground mb-1.5">
                                    {t("rankTracker.modal.urlLabel")}
                                </label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="modal-url"
                                        type="text"
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        placeholder={t("rankTracker.modal.urlPlaceholder")}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal-country" className="block text-sm font-medium text-foreground mb-1.5">
                                    Country
                                </label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <select
                                        id="modal-country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full pl-11 pr-8 py-3 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary/50 transition-colors text-sm appearance-none"
                                    >
                                        <option value="US">United States (US)</option>
                                        <option value="GB">United Kingdom (GB)</option>
                                        <option value="EG">Egypt (EG)</option>
                                        <option value="SA">Saudi Arabia (SA)</option>
                                        <option value="AE">United Arab Emirates (AE)</option>
                                        <option value="FR">France (FR)</option>
                                        <option value="DE">Germany (DE)</option>
                                        <option value="CA">Canada (CA)</option>
                                        <option value="AU">Australia (AU)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                                <p>{t("rankTracker.modal.hint")}</p>
                            </div>

                            <button type="submit" disabled={adding} className="w-full py-3 rounded-xl bg-primary font-semibold text-sm text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50" style={{ color: "var(--background)" }}>
                                {adding ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Target size={18} />
                                        {t("rankTracker.modal.startBtn")}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
