import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmDialog({ open, title, message, confirmText, cancelText, variant = "danger", onConfirm, onCancel, loading }: ConfirmDialogProps) {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onCancel();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onCancel]);

    if (!open) return null;

    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-amber-500 hover:bg-amber-600",
        info: "bg-accent hover:bg-blue-600"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onCancel}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />

            {/* Dialog */}
            <div
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[scaleIn_200ms_ease-out]"
            >
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-muted hover:bg-border transition-colors disabled:opacity-50"
                    >
                        {cancelText || t("admin.confirm.cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t("admin.confirm.processing")}
                            </span>
                        ) : (
                            confirmText || t("admin.confirm.confirm")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
