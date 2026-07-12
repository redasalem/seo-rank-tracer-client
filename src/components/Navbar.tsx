import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Search, BarChart3, History, LogOut, Menu, X, Target, Sun, Moon, ChartNoAxesColumnIcon, Settings as SettingsIcon, Users, Languages, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import NotificationBell from "./NotificationBell";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { user , logout } = useApp();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);
    
    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path: string) => location.pathname === path;

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const navLinks = [
        { path: "/dashboard", label: t("navbar.dashboard"), icon: <BarChart3 size={18} />, tour: "dashboard" },
        { path: "/analyze", label: t("navbar.analyze"), icon: <Search size={18} />, tour: "analyze" },
        { path: "/rank-tracker", label: t("navbar.rankTracker"), icon: <Target size={18} />, tour: "rank-tracker" },
        { path: "/competitors", label: t("navbar.competitors"), icon: <Users size={18} /> },
        { path: "/history", label: t("navbar.history"), icon: <History size={18} /> },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 no-print ${isScrolled ? "bg-background/70 backdrop-blur-xl border-b border-border shadow-sm py-2" : "bg-transparent border-transparent py-4"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <ChartNoAxesColumnIcon />
                        <span className="text-xl tracking-tight text-foreground">RankBoost</span>
                    </Link>

                    {/* Desktop nav */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} data-tour={link.tour} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isActive(link.path) ? "bg-accent/5 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}>
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={toggleLanguage} className="flex items-center gap-2 p-2 px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors font-medium text-sm">
                            <Languages size={18} />
                            {i18n.language === 'ar' ? 'En' : 'ع'}
                        </button>
                        
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center justify-center" aria-label="Toggle theme">
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <>
                                <NotificationBell />
                                {user.plan === 'free' && (
                                    <Link to="/settings?tab=subscription" data-tour="upgrade" className="px-3 py-1.5 text-xs font-bold rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-white transition-colors">
                                        {t("navbar.upgrade")}
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border bg-card text-sm">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold" style={{ color: "var(--background)" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-foreground font-medium max-w-[80px] sm:max-w-[120px] truncate" title={user.name}>{user.name}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-accent/10 border border-accent/15 text-accent shrink-0">{user.plan}</span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="p-2 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors flex items-center justify-center" aria-label="Admin Panel" title="Admin Panel">
                                        <Shield size={18} />
                                    </Link>
                                )}
                                <Link to="/settings" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center justify-center" aria-label="Settings">
                                    <SettingsIcon size={18} />
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                    <LogOut size={16} />
                                    {t("navbar.logout")}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    {t("navbar.login")}
                                </Link>
                                <Link to="/register" className="px-5 py-2 rounded-full bg-primary text-sm transition-opacity" style={{ color: "var(--background)" }}>
                                    {t("navbar.getStarted")}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle container */}
                    <div className="flex items-center gap-1 md:hidden">
                        {user && <NotificationBell />}
                        <button onClick={toggleLanguage} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors font-medium text-sm flex items-center justify-center">
                            {i18n.language === 'ar' ? 'En' : 'ع'}
                        </button>
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="text-muted-foreground hover:text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-b border-border bg-background origin-top">
                    <div className="px-4 py-3 space-y-1">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-muted rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold" style={{ color: "var(--background)" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-foreground">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                    {user.plan === 'free' && (
                                        <Link to="/settings?tab=subscription" onClick={() => setMobileOpen(false)} className="px-2.5 py-1 text-xs font-bold rounded-lg bg-accent/10 text-accent border border-accent/20">
                                            {t("navbar.upgrade")}
                                        </Link>
                                    )}
                                </div>
                                <div className="py-2 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.path) ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    to="/settings"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full mt-2"
                                >
                                    <SettingsIcon size={18} />
                                    {t("navbar.settings")}
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-danger hover:bg-danger/10 w-full mt-2"
                                >
                                    <LogOut size={18} />
                                    {t("navbar.logout")}
                                </button>
                            </>
                        ) : (
                            <div className="py-2 space-y-2">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium text-foreground text-center rounded-lg hover:bg-muted">
                                    {t("navbar.login")}
                                </Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold text-center rounded-lg bg-primary" style={{ color: "var(--background)" }}>
                                    {t("navbar.getStarted")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
