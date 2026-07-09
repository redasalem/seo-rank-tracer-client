import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Crown, Shield, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
    _id: string;
    name: string;
    email: string;
    plan: string;
    role: string;
    createdAt: string;
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
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "15" });
            if (search) params.append("search", search);
            if (planFilter !== "all") params.append("plan", planFilter);

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
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planFilter]);

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

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <div className="bg-card border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">{t("admin.users.title")}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{t("admin.users.subtitle")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <ArrowLeft size={16} />
                            {t("admin.nav.dashboard")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("admin.users.searchPlaceholder")}
                            className="w-full ps-11 pe-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                        />
                    </form>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                        <option value="all">{t("admin.users.filterAll")}</option>
                        <option value="free">{t("admin.users.filterFree")}</option>
                        <option value="pro">{t("admin.users.filterPro")}</option>
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
                                    <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.joined")}</th>
                                    <th className="text-start px-5 py-3.5 text-muted-foreground font-medium">{t("admin.users.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-muted-foreground">No users found</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-5 py-4 text-foreground font-medium">{user.name}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.plan === "pro" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>
                                                    {user.plan === "pro" && <Crown size={12} />}
                                                    {user.plan.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"}`}>
                                                    {user.role === "admin" && <Shield size={12} />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateUser(user._id, { plan: user.plan === "pro" ? "free" : "pro" })}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                                                    >
                                                        {t("admin.users.changePlan")}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateUser(user._id, { role: user.role === "admin" ? "user" : "admin" })}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.role === "admin" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"}`}
                                                    >
                                                        {user.role === "admin" ? (
                                                            <span className="flex items-center gap-1"><ShieldOff size={12} />{t("admin.users.removeAdmin")}</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1"><Shield size={12} />{t("admin.users.makeAdmin")}</span>
                                                        )}
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
                                {t("admin.users.page")} {pagination.page} {t("admin.users.of")} {pagination.pages}
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
            </div>

        </div>
    );
};

export default AdminUsers;
