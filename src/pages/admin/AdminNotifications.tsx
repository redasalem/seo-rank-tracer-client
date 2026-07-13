import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Send, Bell, Users, Crown, Gem, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const AdminNotifications = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    
    const [title, setTitle] = useState("");
    const [messageKey, setMessageKey] = useState("");
    const [audience, setAudience] = useState("all");
    const [type, setType] = useState("info");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !messageKey.trim()) {
            toast.error(t("admin.notifications.requiredError"));
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/admin/notifications/bulk", {
                title,
                messageKey, // Important: client will translate this key
                audience,
                type
            });
            if (data.success) {
                toast.success(t("admin.notifications.sendSuccess"));
                setTitle("");
                setMessageKey("");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("admin.notifications.sendFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">{t("admin.notifications.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("admin.notifications.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSend} className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.notifications.targetAudience")}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "all", label: t("admin.notifications.allUsers"), icon: Users },
                                        { id: "free", label: t("admin.notifications.freeUsers"), icon: Users },
                                        { id: "pro", label: t("admin.notifications.proUsers"), icon: Crown },
                                        { id: "max", label: t("admin.notifications.maxUsers"), icon: Gem },
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setAudience(opt.id)}
                                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                                                audience === opt.id ? "border-accent bg-accent/5 text-accent" : "border-border text-muted-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <opt.icon size={16} />
                                            <span className="text-sm font-medium">{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.notifications.notiType")}</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { id: "info", color: "blue", icon: Info },
                                        { id: "success", color: "emerald", icon: CheckCircle },
                                        { id: "warning", color: "amber", icon: AlertTriangle },
                                        { id: "error", color: "red", icon: AlertCircle },
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setType(opt.id)}
                                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                                                type === opt.id ? `border-${opt.color}-500 bg-${opt.color}-500/10 text-${opt.color}-500` : "border-border text-muted-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <opt.icon size={16} />
                                            <span className="text-[10px] uppercase font-bold">{opt.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.notifications.notiTitle")}</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder={t("admin.notifications.titlePlaceholder")}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.notifications.messageKey")}</label>
                                <textarea
                                    value={messageKey}
                                    onChange={e => setMessageKey(e.target.value)}
                                    placeholder={t("admin.notifications.messagePlaceholder")}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-1">{t("admin.notifications.messageHint")}</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                            {t("admin.notifications.sendBtn")}
                        </button>
                    </div>
                </form>

                {/* Preview */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">{t("admin.notifications.preview")}</h2>
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex gap-3">
                            <div className={`mt-0.5 shrink-0 size-10 rounded-full flex items-center justify-center ${
                                type === "info" ? "bg-blue-500/10 text-blue-500" :
                                type === "success" ? "bg-emerald-500/10 text-emerald-500" :
                                type === "warning" ? "bg-amber-500/10 text-amber-500" :
                                "bg-red-500/10 text-red-500"
                            }`}>
                                <Bell size={18} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-foreground">{title || t("admin.notifications.titlePlaceholder")}</h3>
                                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{messageKey || t("admin.notifications.messagePlaceholder")}</p>
                                <p className="text-xs text-muted-foreground mt-2 opacity-50">{t("admin.notifications.justNow")}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-muted/50 border border-border rounded-xl p-4 flex gap-3">
                        <Info size={18} className="text-muted-foreground shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t("admin.notifications.infoDesc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
