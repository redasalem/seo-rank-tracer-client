import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { Save, Sliders, HardDrive, Shield } from "lucide-react";
import toast from "react-hot-toast";

const AdminSettings = () => {
    const { api } = useApp();
    const { t } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get("/api/admin/settings");
                if (data.success) {
                    setSettings(data.settings);
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [api]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.put("/api/admin/settings", { settings });
            if (data.success) {
                toast.success(t("admin.settings.saveSuccess"));
            }
        } catch {
            toast.error(t("admin.settings.saveFailed"));
        } finally {
            setSaving(false);
        }
    };

    const updatePlanLimit = (plan: string, type: string, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSettings((prev: any) => ({
            ...prev,
            planLimits: {
                ...prev.planLimits,
                [plan]: {
                    ...prev.planLimits[plan],
                    [type]: value === "" ? -1 : parseInt(value, 10)
                }
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t("admin.settings.title")}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t("admin.settings.subtitle")}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                    {t("admin.settings.save")}
                </button>
            </div>

            <div className="space-y-6">
                {/* Plan Limits */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                        <Sliders size={20} className="text-accent" />
                        <h2 className="text-base font-semibold text-foreground">{t("admin.settings.planLimits")}</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Free Plan */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground border-b border-border pb-2">Free Plan</h3>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Analyses / mo</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.free?.analyses === -1 ? "" : settings.planLimits?.free?.analyses}
                                        onChange={(e) => updatePlanLimit("free", "analyses", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Keywords</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.free?.keywords === -1 ? "" : settings.planLimits?.free?.keywords}
                                        onChange={(e) => updatePlanLimit("free", "keywords", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Pro Plan */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-amber-500 border-b border-border pb-2">Pro Plan</h3>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Analyses / mo</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.pro?.analyses === -1 ? "" : settings.planLimits?.pro?.analyses}
                                        onChange={(e) => updatePlanLimit("pro", "analyses", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Keywords</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.pro?.keywords === -1 ? "" : settings.planLimits?.pro?.keywords}
                                        onChange={(e) => updatePlanLimit("pro", "keywords", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Max Plan */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-purple-500 border-b border-border pb-2">Max Plan</h3>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Analyses / mo</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.max?.analyses === -1 ? "" : settings.planLimits?.max?.analyses}
                                        onChange={(e) => updatePlanLimit("max", "analyses", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Max Keywords</label>
                                    <input 
                                        type="number" 
                                        value={settings.planLimits?.max?.keywords === -1 ? "" : settings.planLimits?.max?.keywords}
                                        onChange={(e) => updatePlanLimit("max", "keywords", e.target.value)}
                                        placeholder="Unlimited (-1)"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 italic">{t("admin.settings.limitsHint")}</p>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                        <HardDrive size={20} className="text-accent" />
                        <h2 className="text-base font-semibold text-foreground">{t("admin.settings.system")}</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <div>
                                <h3 className="font-medium text-foreground flex items-center gap-2">
                                    <Shield size={16} />
                                    {t("admin.settings.maintenanceMode")}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{t("admin.settings.maintenanceDesc")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.maintenanceMode || false}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
