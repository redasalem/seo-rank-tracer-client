import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, Activity, Trash2, ShieldBan, Shield, Edit, Mail, HardDrive } from "lucide-react";

interface AuditLogData {
    _id: string;
    admin: { _id: string; name: string; email: string } | null;
    action: string;
    target: string;
    targetId: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: any;
    ip: string;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
}

const AdminAuditLog = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    const [logs, setLogs] = useState<AuditLogData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "30" });
            if (search) params.append("search", search);
            if (actionFilter !== "all") params.append("action", actionFilter);

            const { data } = await api.get(`/api/admin/audit-log?${params}`);
            if (data.success) {
                setLogs(data.logs);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch audit log", err);
        } finally {
            setLoading(false);
        }
    }, [api, search, actionFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLogs();
    }, [fetchLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLogs(1);
    };

    const getActionBadge = (action: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
            "DELETE_USER": { color: "text-red-500 bg-red-500/10", icon: <Trash2 size={12} /> },
            "BAN_USER": { color: "text-orange-500 bg-orange-500/10", icon: <ShieldBan size={12} /> },
            "UNBAN_USER": { color: "text-emerald-500 bg-emerald-500/10", icon: <Shield size={12} /> },
            "UPDATE_USER": { color: "text-blue-500 bg-blue-500/10", icon: <Edit size={12} /> },
            "DELETE_ANALYSIS": { color: "text-red-500 bg-red-500/10", icon: <Trash2 size={12} /> },
            "DELETE_KEYWORD": { color: "text-red-500 bg-red-500/10", icon: <Trash2 size={12} /> },
            "BULK_NOTIFICATION": { color: "text-purple-500 bg-purple-500/10", icon: <Mail size={12} /> },
            "UPDATE_SETTINGS": { color: "text-accent bg-accent/10", icon: <HardDrive size={12} /> }
        };

        const c = config[action] || { color: "text-muted-foreground bg-muted", icon: <Activity size={12} /> };
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
                {c.icon}
                {action.replace(/_/g, " ")}
            </span>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.audit.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.audit.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("admin.audit.searchPlaceholder")}
                        className="w-full ps-11 pe-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                    />
                </form>
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
                >
                    <option value="all">{t("admin.audit.filterAll")}</option>
                    <option value="UPDATE_USER">Update User</option>
                    <option value="BAN_USER">Ban User</option>
                    <option value="UNBAN_USER">Unban User</option>
                    <option value="DELETE_USER">Delete User</option>
                    <option value="DELETE_ANALYSIS">Delete Analysis</option>
                    <option value="DELETE_KEYWORD">Delete Keyword</option>
                    <option value="BULK_NOTIFICATION">Notification</option>
                    <option value="UPDATE_SETTINGS">Update Settings</option>
                </select>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.audit.date")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.audit.admin")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.audit.action")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.audit.target")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.audit.details")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">{t("admin.audit.noData")}</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <p className="font-medium text-foreground">{new Date(log.createdAt).toLocaleDateString()}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {log.admin ? (
                                                <Link to={`/admin/users/${log.admin._id}`} className="hover:text-accent transition-colors">
                                                    <p className="font-medium text-foreground">{log.admin.name}</p>
                                                    <p className="text-xs text-muted-foreground">{log.admin.email}</p>
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">System</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-foreground">{log.target}</p>
                                            {log.targetId && (
                                                <p className="text-[10px] text-muted-foreground font-mono truncate w-24" title={log.targetId}>{log.targetId}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs text-muted-foreground max-w-xs overflow-hidden text-ellipsis whitespace-nowrap bg-background p-1.5 rounded-lg border border-border">
                                                {JSON.stringify(log.details)}
                                            </div>
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
                            {t("admin.common.showing")} {((pagination.page - 1) * 30) + 1}-{Math.min(pagination.page * 30, pagination.total)} {t("admin.common.of")} {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchLogs(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => fetchLogs(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLog;
