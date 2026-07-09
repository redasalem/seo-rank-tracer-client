import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, TrendingUp, TrendingDown, Info, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
interface Notification {
    _id: string;
    title: string;
    message: { key: string; data?: Record<string, string | number> } | string;
    type: "info" | "success" | "warning" | "error";
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; right: number } | null>(null);
    const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchNotifications = useCallback(async () => {
        const res = await getNotifications();
        if (res.success && res.data) {
            setNotifications(res.data as unknown as Notification[]);
        }
    }, [getNotifications]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount
        fetchNotifications();
        
        // Polling every 5 minutes (optional, could be removed if real-time isn't strictly needed)
        const interval = setInterval(() => {
            fetchNotifications();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                (!portalRef.current || !portalRef.current.contains(event.target as Node))
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on resize to prevent floating portal misalignment
    useEffect(() => {
        const handleResize = () => setIsOpen(false);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleRead = async (notification: Notification) => {
        setIsOpen(false);
        navigate(notification.link || "/rank-tracker");

        if (notification.isRead) return;
        
        // Optimistic update
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)));
        await markNotificationAsRead(notification._id);
    };

    const handleReadAll = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        await markAllNotificationsAsRead();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <TrendingUp size={16} className="text-success" />;
            case "warning": return <TrendingDown size={16} className="text-warning" />;
            case "error": return <AlertTriangle size={16} className="text-danger" />;
            default: return <Info size={16} className="text-accent" />;
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            const rect = dropdownRef.current?.getBoundingClientRect();
            if (rect) {
                setDropdownCoords({
                    top: rect.bottom + 16,
                    right: window.innerWidth - rect.right
                });
            }
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative pointer-events-auto" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative flex items-center justify-center"
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background"></span>
                )}
            </button>

            {isOpen && dropdownCoords && createPortal(
                <div 
                    ref={portalRef}
                    style={{ top: dropdownCoords.top, right: dropdownCoords.right }}
                    className="fixed mt-2 w-80 sm:w-96 glass rounded-2xl shadow-xl overflow-hidden z-[99999] animate-in fade-in slide-in-from-top-2"
                >
                    <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleReadAll}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Check size={12} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto bg-card/80">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No notifications yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleRead(notification)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                                            !notification.isRead ? "bg-primary/5" : ""
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="shrink-0 mt-1">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium text-foreground ${!notification.isRead ? "font-semibold" : ""}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                    {typeof notification.message === 'string' 
                                                        ? notification.message 
                                                        : t(notification.message.key, notification.message.data) as string}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-2 opacity-70">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
