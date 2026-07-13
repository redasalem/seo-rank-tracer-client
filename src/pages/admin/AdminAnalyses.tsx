import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface AnalysisData {
    _id: string;
    url: string;
    domain: string;
    overallScore: number;
    status: string;
    createdAt: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
    categories: {
        seo: number;
        performance: number;
        accessibility: number;
        bestPractices: number;
    };
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
}

const AdminAnalyses = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmId, setConfirmId] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);

    const fetchAnalyses = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "15" });
            if (search) params.append("search", search);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const { data } = await api.get(`/api/admin/analyses?${params}`);
            if (data.success) {
                setAnalyses(data.analyses);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch analyses", err);
        } finally {
            setLoading(false);
        }
    }, [api, search, statusFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAnalyses();
    }, [fetchAnalyses]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAnalyses(1);
    };

    const handleDelete = async () => {
        setConfirmLoading(true);
        try {
            const { data } = await api.delete(`/api/admin/analyses/${confirmId}`);
            if (data.success) {
                setAnalyses(prev => prev.filter(a => a._id !== confirmId));
                toast.success(t("admin.analyses.deleteSuccess"));
            }
        } catch {
            toast.error(t("admin.analyses.deleteFailed"));
        } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.analyses.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.analyses.subtitle")}</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("admin.analyses.searchPlaceholder")}
                        className="w-full ps-11 pe-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                    />
                </form>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
                >
                    <option value="all">{t("admin.analyses.statusAll")}</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.domain")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.user")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.score")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.status")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.date")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.analyses.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : analyses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">{t("admin.analyses.noData")}</td>
                                </tr>
                            ) : (
                                analyses.map((analysis) => (
                                    <tr key={analysis._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-foreground">{analysis.domain}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{analysis.url}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {analysis.userId ? (
                                                <Link to={`/admin/users/${analysis.userId._id}`} className="hover:text-accent transition-colors">
                                                    <p className="font-medium text-foreground">{analysis.userId.name}</p>
                                                    <p className="text-xs text-muted-foreground">{analysis.userId.email}</p>
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">Unknown User</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`font-bold ${analysis.overallScore >= 80 ? "text-emerald-500" : analysis.overallScore >= 50 ? "text-amber-500" : "text-red-500"}`}>
                                                {analysis.overallScore}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                analysis.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : 
                                                analysis.status === "failed" ? "bg-red-500/10 text-red-500" : 
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>
                                                {analysis.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(analysis.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/report/${analysis._id}`}
                                                    className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                                                    title={t("admin.analyses.view")}
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => { setConfirmId(analysis._id); setConfirmOpen(true); }}
                                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                                    title={t("admin.analyses.delete")}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            {t("admin.common.showing")} {((pagination.page - 1) * 15) + 1}-{Math.min(pagination.page * 15, pagination.total)} {t("admin.common.of")} {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchAnalyses(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => fetchAnalyses(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title={t("admin.analyses.confirmDeleteTitle")}
                message={t("admin.analyses.confirmDeleteMsg")}
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                loading={confirmLoading}
            />
        </div>
    );
};

export default AdminAnalyses;
