import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Users, Crown, KeyRound, TrendingUp, ArrowLeft, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Stats {
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    totalKeywords: number;
    newUsersLast30Days: number;
    monthlyGrowth: { month: string; users: number }[];
}

const AdminDashboard = () => {
    const { token } = useApp();
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = stats ? [
        { label: t("admin.dashboard.totalUsers"), value: stats.totalUsers, icon: <Users size={22} />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: t("admin.dashboard.proUsers"), value: stats.proUsers, icon: <Crown size={22} />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: t("admin.dashboard.freeUsers"), value: stats.freeUsers, icon: <Users size={22} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: t("admin.dashboard.totalKeywords"), value: stats.totalKeywords, icon: <KeyRound size={22} />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: t("admin.dashboard.newUsers30d"), value: stats.newUsersLast30Days, icon: <UserPlus size={22} />, color: "text-pink-500", bg: "bg-pink-500/10" },
    ] : [];

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <div className="bg-card border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">{t("admin.dashboard.title")}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{t("admin.dashboard.subtitle")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/users" className="px-4 py-2 rounded-xl bg-primary text-sm font-medium hover:opacity-90 transition-opacity" style={{ color: "var(--background)" }}>
                            {t("admin.nav.users")}
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <ArrowLeft size={16} />
                            {t("admin.nav.backToApp")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
                            <div className={`${card.bg} ${card.color} size-10 rounded-xl flex items-center justify-center mb-3`}>
                                {card.icon}
                            </div>
                            <p className="text-2xl font-bold text-foreground">{card.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Growth Chart */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">{t("admin.dashboard.growthChart")}</h2>
                    </div>
                    {stats && stats.monthlyGrowth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.monthlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}
                                    labelStyle={{ color: "var(--foreground)" }}
                                />
                                <Bar dataKey="users" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noGrowthData")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
