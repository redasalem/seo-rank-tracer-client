import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Users, Crown, KeyRound, TrendingUp, UserPlus, ShieldBan, Gem, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

interface Stats {
    totalUsers: number;
    proUsers: number;
    maxUsers: number;
    freeUsers: number;
    bannedUsers: number;
    totalKeywords: number;
    totalAnalyses: number;
    newUsersLast30Days: number;
    monthlyGrowth: { month: string; users: number }[];
    planDistribution: { name: string; value: number; color: string }[];
    recentSignups: { _id: string; name: string; email: string; plan: string; role: string; createdAt: string; isBanned: boolean }[];
    recentAnalyses: { _id: string; url: string; domain: string; overallScore: number; status: string; createdAt: string; userId?: { name: string; email: string } }[];
}

const AdminDashboard = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/api/admin/stats");
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [api]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = stats ? [
        { label: t("admin.dashboard.totalUsers"), value: stats.totalUsers, icon: <Users size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: t("admin.dashboard.proUsers"), value: stats.proUsers, icon: <Crown size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: t("admin.dashboard.maxUsers"), value: stats.maxUsers, icon: <Gem size={20} />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: t("admin.dashboard.freeUsers"), value: stats.freeUsers, icon: <Users size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: t("admin.dashboard.totalKeywords"), value: stats.totalKeywords, icon: <KeyRound size={20} />, color: "text-teal-500", bg: "bg-teal-500/10" },
        { label: t("admin.dashboard.totalAnalyses"), value: stats.totalAnalyses, icon: <Search size={20} />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: t("admin.dashboard.newUsers30d"), value: stats.newUsersLast30Days, icon: <UserPlus size={20} />, color: "text-pink-500", bg: "bg-pink-500/10" },
        { label: t("admin.dashboard.bannedUsers"), value: stats.bannedUsers, icon: <ShieldBan size={20} />, color: "text-red-500", bg: "bg-red-500/10" },
    ] : [];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.dashboard.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.dashboard.subtitle")}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:border-accent/30 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5">
                        <div className={`${card.bg} ${card.color} size-10 rounded-xl flex items-center justify-center mb-3`}>
                            {card.icon}
                        </div>
                        <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={18} className="text-accent" />
                        <h2 className="text-base font-semibold text-foreground">{t("admin.dashboard.growthChart")}</h2>
                    </div>
                    {stats && stats.monthlyGrowth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stats.monthlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }}
                                    labelStyle={{ color: "var(--foreground)" }}
                                />
                                <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noGrowthData")}</p>
                    )}
                </div>

                {/* Plan Distribution */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-foreground mb-6">{t("admin.dashboard.planDistribution")}</h2>
                    {stats && stats.planDistribution.some(p => p.value > 0) ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={stats.planDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {stats.planDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noData")}</p>
                    )}
                    <div className="flex justify-center gap-4 mt-2">
                        {stats?.planDistribution.map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-xs text-muted-foreground">{p.name} ({p.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Signups */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">{t("admin.dashboard.recentSignups")}</h2>
                        <Link to="/admin/users" className="text-xs text-accent hover:underline">{t("admin.dashboard.viewAll")}</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                {stats?.recentSignups.map((u) => (
                                    <tr key={u._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3">
                                            <Link to={`/admin/users/${u._id}`} className="text-foreground font-medium hover:text-accent transition-colors">{u.name}</Link>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.plan === "pro" ? "bg-amber-500/10 text-amber-500" : u.plan === "max" ? "bg-purple-500/10 text-purple-500" : "bg-muted text-muted-foreground"}`}>
                                                {u.plan.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Analyses */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">{t("admin.dashboard.recentAnalyses")}</h2>
                        <Link to="/admin/analyses" className="text-xs text-accent hover:underline">{t("admin.dashboard.viewAll")}</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                {stats?.recentAnalyses.map((a) => (
                                    <tr key={a._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="text-foreground font-medium truncate max-w-[200px]">{a.domain}</p>
                                            <p className="text-xs text-muted-foreground">{a.userId?.name || "Unknown"}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-bold ${a.overallScore >= 80 ? "text-emerald-500" : a.overallScore >= 50 ? "text-amber-500" : "text-red-500"}`}>
                                                {a.overallScore}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : a.status === "failed" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
