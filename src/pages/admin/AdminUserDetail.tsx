import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft, User, Mail, Calendar, ShieldBan, Trash2, KeyRound, Search, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface UserDetail {
    user: {
        _id: string;
        name: string;
        email: string;
        plan: string;
        role: string;
        createdAt: string;
        isBanned: boolean;
        isVerified: boolean;
        lastAnalysisDate: string | null;
        analysisCount: number;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keywords: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analyses: any[];
    counts: {
        keywords: number;
        analyses: number;
    };
}

const AdminUserDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { api, user: currentUser } = useApp();
    const { t } = useTranslation();
    
    const [data, setData] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"delete" | "ban">("delete");
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetail = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/api/admin/users/${id}`);
                if (response.data.success) {
                    setData(response.data);
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                toast.error(err.response?.data?.message || t("admin.users.fetchError"));
                navigate("/admin/users");
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetail();
    }, [id, api, navigate, t]);

    const handleUpdateUser = async (updates: { plan?: string; role?: string }) => {
        if (!id || !data) return;
        try {
            const response = await api.put(`/api/admin/users/${id}`, updates);
            if (response.data.success) {
                setData({
                    ...data,
                    user: { ...data.user, ...updates }
                });
                toast.success(t("admin.users.updateSuccess"));
            }
        } catch {
            toast.error(t("admin.users.updateFailed"));
        }
    };

    const executeConfirm = async () => {
        if (!id || !data) return;
        setConfirmLoading(true);
        try {
            if (confirmAction === "delete") {
                const response = await api.delete(`/api/admin/users/${id}`);
                if (response.data.success) {
                    toast.success(t("admin.users.deleteSuccess"));
                    navigate("/admin/users");
                }
            } else if (confirmAction === "ban") {
                const response = await api.put(`/api/admin/users/${id}/ban`);
                if (response.data.success) {
                    setData({
                        ...data,
                        user: { ...data.user, isBanned: response.data.isBanned }
                    });
                    toast.success(response.data.isBanned ? t("admin.users.banSuccess") : t("admin.users.unbanSuccess"));
                }
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("admin.users.actionFailed"));
        } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const { user, counts, keywords, analyses } = data;
    const isSelf = currentUser?.id === user._id;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/users" className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        {user.name}
                        {user.isBanned && (
                            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-xs font-semibold uppercase tracking-wider">
                                {t("admin.users.banned")}
                            </span>
                        )}
                        {user.role === "admin" && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-semibold uppercase tracking-wider">
                                {t("admin.users.roleAdmin")}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: User Info & Actions */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">{t("admin.userDetail.info")}</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">{t("admin.users.name")}</p>
                                    <p className="font-medium text-foreground">{user.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">{t("admin.users.email")}</p>
                                    <p className="font-medium text-foreground">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">{t("admin.users.joined")}</p>
                                    <p className="font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">{t("admin.userDetail.plan")}</p>
                                <select 
                                    value={user.plan}
                                    onChange={(e) => handleUpdateUser({ plan: e.target.value })}
                                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:border-accent"
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="max">Max</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">{t("admin.userDetail.role")}</p>
                                <select 
                                    value={user.role}
                                    onChange={(e) => handleUpdateUser({ role: e.target.value })}
                                    disabled={isSelf}
                                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:border-accent disabled:opacity-50"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-red-500 mb-4">
                            <AlertTriangle size={18} />
                            <h2 className="text-lg font-semibold">{t("admin.userDetail.dangerZone")}</h2>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => { setConfirmAction("ban"); setConfirmOpen(true); }}
                                disabled={isSelf}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    user.isBanned 
                                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                                    : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                }`}
                            >
                                <ShieldBan size={16} />
                                {user.isBanned ? t("admin.users.unban") : t("admin.users.ban")}
                            </button>
                            
                            <button
                                onClick={() => { setConfirmAction("delete"); setConfirmOpen(true); }}
                                disabled={isSelf}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={16} />
                                {t("admin.users.delete")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Usage & History */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <KeyRound size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{counts.keywords}</p>
                                <p className="text-sm text-muted-foreground">{t("admin.userDetail.trackedKeywords")}</p>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <Search size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{counts.analyses}</p>
                                <p className="text-sm text-muted-foreground">{t("admin.userDetail.totalAnalyses")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Analyses */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">{t("admin.userDetail.recentAnalyses")}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border text-muted-foreground">
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.analyses.domain")}</th>
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.analyses.score")}</th>
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.analyses.date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyses.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">{t("admin.analyses.noData")}</td></tr>
                                    ) : (
                                        analyses.map(a => (
                                            <tr key={a._id} className="border-b border-border last:border-0 hover:bg-muted/10">
                                                <td className="px-5 py-3">
                                                    <Link to={`/report/${a._id}`} className="font-medium text-foreground hover:text-accent truncate block max-w-[200px]">{a.domain}</Link>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`font-bold ${a.overallScore >= 80 ? "text-emerald-500" : a.overallScore >= 50 ? "text-amber-500" : "text-red-500"}`}>
                                                        {a.overallScore}%
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Keywords */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">{t("admin.userDetail.recentKeywords")}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border text-muted-foreground">
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.keywords.keyword")}</th>
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.keywords.domain")}</th>
                                        <th className="text-start px-5 py-2.5 font-medium">{t("admin.keywords.position")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keywords.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">{t("admin.keywords.noData")}</td></tr>
                                    ) : (
                                        keywords.map(k => (
                                            <tr key={k._id} className="border-b border-border last:border-0 hover:bg-muted/10">
                                                <td className="px-5 py-3 font-medium text-foreground">{k.keyword}</td>
                                                <td className="px-5 py-3 text-muted-foreground">{k.domain}</td>
                                                <td className="px-5 py-3">
                                                    {k.currentPosition ? (
                                                        <span className="font-bold text-foreground">{k.currentPosition}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title={confirmAction === "delete" ? t("admin.users.confirmDeleteTitle") : t("admin.users.confirmBanTitle")}
                message={
                    confirmAction === "delete"
                        ? t("admin.users.confirmDeleteMsg", { name: user.name })
                        : t("admin.users.confirmBanMsg", { name: user.name })
                }
                variant={confirmAction === "delete" ? "danger" : "warning"}
                confirmText={confirmAction === "delete" ? t("admin.users.delete") : t("admin.users.confirm")}
                onConfirm={executeConfirm}
                onCancel={() => setConfirmOpen(false)}
                loading={confirmLoading}
            />
        </div>
    );
};

export default AdminUserDetail;
