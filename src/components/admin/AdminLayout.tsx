import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    LayoutDashboard,
    Users,
    Search,
    KeyRound,
    Bell,
    Settings,
    ClipboardList,
    ArrowLeft,
    PanelLeftClose,
    PanelLeftOpen,
    Shield,
    Menu,
    X
} from "lucide-react";

const navItems = [
    { key: "dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { key: "users", path: "/admin/users", icon: Users },
    { key: "analyses", path: "/admin/analyses", icon: Search },
    { key: "keywords", path: "/admin/keywords", icon: KeyRound },
    { key: "notifications", path: "/admin/notifications", icon: Bell },
    { key: "settings", path: "/admin/settings", icon: Settings },
    { key: "activity", path: "/admin/activity", icon: ClipboardList },
];

export default function AdminLayout() {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const linkBase = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";
    const linkActive = "bg-accent/10 text-accent";
    const linkInactive = "text-muted-foreground hover:text-foreground hover:bg-muted/50";

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="px-4 py-5 border-b border-border flex items-center gap-3">
                <div className="size-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Shield size={20} className="text-accent" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">RankBoost</p>
                        <p className="text-[11px] text-accent font-medium">{t("admin.layout.adminPanel")}</p>
                    </div>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive} ${collapsed ? "justify-center px-2" : ""}`
                        }
                    >
                        <item.icon size={18} className="shrink-0" />
                        {!collapsed && <span>{t(`admin.layout.nav.${item.key}`)}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-border space-y-1">
                <Link
                    to="/dashboard"
                    className={`${linkBase} ${linkInactive} ${collapsed ? "justify-center px-2" : ""}`}
                >
                    <ArrowLeft size={18} className="shrink-0" />
                    {!collapsed && <span>{t("admin.layout.backToApp")}</span>}
                </Link>

                {/* Collapse toggle — desktop only */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`${linkBase} ${linkInactive} w-full hidden lg:flex ${collapsed ? "justify-center px-2" : ""}`}
                >
                    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    {!collapsed && <span>{t("admin.layout.collapse")}</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col border-e border-border bg-card/50 backdrop-blur-sm shrink-0 sticky top-0 h-screen transition-all duration-300 ${
                    collapsed ? "w-[68px]" : "w-[240px]"
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Shield size={16} className="text-accent" />
                    </div>
                    <span className="text-sm font-bold text-foreground">Admin</span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <aside
                        className="absolute top-0 start-0 h-full w-[260px] bg-card border-e border-border flex flex-col animate-[slideIn_200ms_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebarContent}
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 lg:pt-0 pt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
