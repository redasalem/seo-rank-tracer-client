interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card";
    count?: number;
}

export default function Skeleton({ className = "", variant = "rectangular", count = 1 }: SkeletonProps) {
    const baseClasses = "skeleton";

    const variantClasses = {
        text: "h-4 w-full rounded-md",
        circular: "rounded-full aspect-square",
        rectangular: "rounded-xl",
        card: "h-48 w-full rounded-2xl",
    }[variant];

    if (count === 1) {
        return <div className={`${baseClasses} ${variantClasses} ${className}`} />;
    }

    return (
        <div className="space-y-3 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`${baseClasses} ${variantClasses} ${className}`} />
            ))}
        </div>
    );
}

// Prebuilt Skeleton for Dashboard Stats Cards
export function StatCardSkeleton() {
    return (
        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton variant="circular" className="size-10" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-36" />
        </div>
    );
}

// Prebuilt Skeleton for Tables / Lists
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i === 0 ? "w-1/3" : "w-16"}`} />
            ))}
        </div>
    );
}
