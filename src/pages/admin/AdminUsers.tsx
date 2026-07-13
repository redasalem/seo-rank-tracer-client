import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, Crown, Shield, ShieldOff, Trash2, ShieldBan, Gem } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface UserData {
    _id: string;
    name: string;
    email: string;
    plan: string;
    role: string;
    createdAt: string;
    isBanned?: boolean;
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
}

const AdminUsers = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string; userName: string }>({ type: "", userId: "", userName: "" });
    const [confirmLoading, setConfirmLoading] = useState(false);

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "15" });
            if (search) params.append("search", search);
            if (planFilter !== "all") params.append("plan", planFilter);
            if (roleFilter !== "all") params.append("role", roleFilter);

            const { data } = await api.get(`/api/admin/users?${params}`);
            if (data.success) {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    }, [api, search, planFilter, roleFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handleUpdateUser = async (userId: string, updates: { plan?: string; role?: string }) => {
        try {
            const { data } = await api.put(`/api/admin/users/${userId}`, updates);
            if (data.success) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...updates } : u));
                toast.success(t("admin.users.updateSuccess"));
            }
        } catch {
            toast.error(t("admin.users.updateFailed"));
        }
    };

    const openConfirm = (type: string, userId: string, userName: string) => {
        setConfirmAction({ type, userId, userName });
        setConfirmOpen(true);
    };

    const executeConfirm = async () => {
        setConfirmLoading(true);
        try {
            if (confirmAction.type === "delete") {
                const { data } = await api.delete(`/api/admin/users/${confirmAction.userId}`);
                if (data.success) {
                    setUsers(prev => prev.filter(u => u._id !== confirmAction.userId));
                    toast.success(t("admin.users.deleteSuccess"));
                }
            } else if (confirmAction.type === "ban") {
                const { data } = await api.put(`/api/admin/users/${confirmAction.userId}/ban`);
                if (data.success) {
                    setUsers(prev => prev.map(u => u._id === confirmAction.userId ? { ...u, isBanned: data.isBanned } : u));
                    toast.success(data.isBanned ? t("admin.users.banSuccess") : t("admin.users.unbanSuccess"));
                }
            }
        } catch {
            toast.error(t("admin.users.actionFailed"));
        } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
        }
    };

    const getPlanBadge = (plan: string) => {
        const styles: Record<string, string> = {
            pro: "bg-amber-500/10 text-amber-500",
            max: "bg-purple-500/10 text-purple-500",
            free: "bg-muted text-muted-foreground"
        };
        const icons: Record<string, React.ReactNode> = {
            pro: <Crown size={12} />,
            max: <Gem size={12} />
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[plan] || styles.free}`}>
                {icons[plan]}
                {plan.toUpperCase()}
            </span>
        );
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.users.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.users.subtitle")}</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("admin.users.searchPlaceholder")}
                        className="w-full ps-11 pe-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                    />
                </form>
                <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
                >
                    <option value="all">{t("admin.users.filterAll")}</option>
                    <option value="free">{t("admin.users.filterFree")}</option>
                    <option value="pro">{t("admin.users.filterPro")}</option>
                    <option value="max">{t("admin.users.filterMax")}</option>
                </select>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
                >
                    <option value="all">{t("admin.users.roleAll")}</option>
                    <option value="user">{t("admin.users.roleUser")}</option>
                    <option value="admin">{t("admin.users.roleAdmin")}</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.name")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.email")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.plan")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.role")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.status")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.joined")}</th>
                                <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">{t("admin.users.noUsers")}</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <Link to={`/admin/users/${user._id}`} className="text-foreground font-medium hover:text-accent transition-colors">
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                                        <td className="px-5 py-4">{getPlanBadge(user.plan)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"}`}>
                                                {user.role === "admin" && <Shield size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {user.isBanned ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                                    <ShieldBan size={12} />
                                                    {t("admin.users.banned")}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                    {t("admin.users.active")}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleUpdateUser(user._id, { plan: user.plan === "pro" ? "free" : user.plan === "max" ? "pro" : "pro" })}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                                                    title={t("admin.users.changePlan")}
                                                >
                                                    {t("admin.users.changePlan")}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateUser(user._id, { role: user.role === "admin" ? "user" : "admin" })}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.role === "admin" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"}`}
                                                    title={user.role === "admin" ? t("admin.users.removeAdmin") : t("admin.users.makeAdmin")}
                                                >
                                                    {user.role === "admin" ? <ShieldOff size={14} /> : <Shield size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => openConfirm("ban", user._id, user.name)}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.isBanned ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"}`}
                                                    title={user.isBanned ? t("admin.users.unban") : t("admin.users.ban")}
                                                >
                                                    <ShieldBan size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openConfirm("delete", user._id, user.name)}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                    title={t("admin.users.delete")}
                                                >
                                                    <Trash2 size={14} />
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
                            {t("admin.users.showing")} {((pagination.page - 1) * 15) + 1}-{Math.min(pagination.page * 15, pagination.total)} {t("admin.users.of")} {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchUsers(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => fetchUsers(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title={confirmAction.type === "delete" ? t("admin.users.confirmDeleteTitle") : t("admin.users.confirmBanTitle")}
                message={
                    confirmAction.type === "delete"
                        ? t("admin.users.confirmDeleteMsg", { name: confirmAction.userName })
                        : t("admin.users.confirmBanMsg", { name: confirmAction.userName })
                }
                variant={confirmAction.type === "delete" ? "danger" : "warning"}
                confirmText={confirmAction.type === "delete" ? t("admin.users.delete") : t("admin.users.confirm")}
                onConfirm={executeConfirm}
                onCancel={() => setConfirmOpen(false)}
                loading={confirmLoading}
            />
        </div>
    );
};

export default AdminUsers;
