import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FolderSearch, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionText,
    actionLink,
    onAction,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border border-border/80"
        >
            <div className="size-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 shadow-[0_0_25px_rgba(139,92,246,0.2)] glow-pulse">
                {icon || <FolderSearch size={36} />}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
                {description}
            </p>

            {actionText && actionLink && (
                <Link
                    to={actionLink}
                    className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
                >
                    <Plus size={16} />
                    <span className="relative z-10">{actionText}</span>
                    <div className="absolute inset-0 shimmer"></div>
                </Link>
            )}

            {actionText && onAction && !actionLink && (
                <button
                    onClick={onAction}
                    className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
                >
                    <Plus size={16} />
                    <span className="relative z-10">{actionText}</span>
                    <div className="absolute inset-0 shimmer"></div>
                </button>
            )}
        </motion.div>
    );
}
