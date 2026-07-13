import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface KeywordData {
    _id: string;
    keyword: string;
    domain: string;
    url: string;
    currentPosition: number | null;
    bestPosition: number | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
}

const AdminKeywords = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmId, setConfirmId] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);

    const fetchKeywords = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "15" });
            if (search) params.append("search", search);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const { data } = await api.get(`/api/admin/keywords?${params}`);
            if (data.success) {
                setKeywords(data.keywords);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch keywords", err);
        } finally {
            setLoading(false);
        }
    }, [api, search, statusFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchKeywords();
    }, [fetchKeywords]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchKeywords(1);
    };

    const handleDelete = async () => {
        setConfirmLoading(true);
        try {
            const { data } = await api.delete(`/api/admin/keywords/${confirmId}`);
            if (data.success) {
                setKeywords(prev => prev.filter(k => k._id !== confirmId));
                toast.success(t("admin.keywords.deleteSuccess"));
            }
        } catch {
            toast.error(t("admin.keywords.deleteFailed"));
        } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.keywords.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.keywords.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("admin.keywords.searchPlaceholder")}
                        className="w-full ps-11 pe-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                    />
                </form>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
                >
                    <option value="all">{t("admin.keywords.statusAll")}</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.keyword")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.user")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.position")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.status")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.lastUpdated")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.keywords.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : keywords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">{t("admin.keywords.noData")}</td>
                                </tr>
                            ) : (
                                keywords.map((keyword) => (
                                    <tr key={keyword._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-foreground">{keyword.keyword}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{keyword.domain}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {keyword.userId ? (
                                                <Link to={`/admin/users/${keyword.userId._id}`} className="hover:text-accent transition-colors">
                                                    <p className="font-medium text-foreground">{keyword.userId.name}</p>
                                                    <p className="text-xs text-muted-foreground">{keyword.userId.email}</p>
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">Unknown User</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {keyword.currentPosition ? (
                                                <div>
                                                    <span className="font-bold text-foreground">{keyword.currentPosition}</span>
                                                    {keyword.bestPosition && (
                                                        <span className="text-xs text-muted-foreground block">Best: {keyword.bestPosition}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                keyword.status === "success" ? "bg-emerald-500/10 text-emerald-500" : 
                                                keyword.status === "failed" ? "bg-red-500/10 text-red-500" : 
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>
                                                {keyword.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(keyword.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => { setConfirmId(keyword._id); setConfirmOpen(true); }}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                                title={t("admin.keywords.delete")}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            {t("admin.common.showing")} {((pagination.page - 1) * 15) + 1}-{Math.min(pagination.page * 15, pagination.total)} {t("admin.common.of")} {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchKeywords(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => fetchKeywords(pagination.page + 1)}
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
                title={t("admin.keywords.confirmDeleteTitle")}
                message={t("admin.keywords.confirmDeleteMsg")}
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                loading={confirmLoading}
            />
        </div>
    );
};

export default AdminKeywords;
